from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt import serializers, settings, authentication as jwt_auth, exceptions as jwt_exc

from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth import get_user_model
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
# from django.utils.timezone import now
# from django.db.models import Q

from .serializers import UserCreateSerializer, TokenObtainPairSerializer, ChangePasswordSerializer
from .tokens import account_activation_token
from .tasks import send_verification_email

User = get_user_model()

# todo 'JWT_REFRESH_COOKIE_NAME' should be setting constant
JWT_REFRESH_COOKIE_NAME = 'rt'


class UserCreateView(UserPassesTestMixin, generics.CreateAPIView):
    # todo account activation via link send by sendgrid/gmail service
    # todo captcha (google recaptcha or similar)
    # todo custom create, 4xx errors
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserCreateSerializer

    def perform_create(self, serializer):
        serializer.save()

        scheme = self.request.scheme
        domain = self.request.get_host()
        send_verification_email.delay(serializer.data.get('id'), scheme, domain)

    def test_func(self):
        return str(self.request.user) == 'AnonymousUser'


class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = TokenObtainPairSerializer.get_token(user)

        response = Response({'access': str(refresh.access_token),
                             "authenticated": True,
                             "message": "ok",
                             'status': 200},
                            status=status.HTTP_200_OK)

        response.delete_cookie(JWT_REFRESH_COOKIE_NAME,
                               path='/api/token/refresh/',
                               domain=request.get_host().split(':')[0])

        response.set_cookie(JWT_REFRESH_COOKIE_NAME, str(refresh),
                            max_age=settings.api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
                            path='/api/token/refresh/',
                            httponly=True,
                            domain=request.get_host().split(':')[0],
                            )

        return response


class BaseTokenView(generics.GenericAPIView):
    permission_classes = ()
    authentication_classes = ()
    serializer_class = None
    www_authenticate_realm = 'api'

    def get_authenticate_header(self, request):
        return '{0} realm="{1}"'.format(
            jwt_auth.AUTH_HEADER_TYPES[0],
            self.www_authenticate_realm,
        )

    def post(self, request, *args, **kwargs):
        auth_data = request.data

        if JWT_REFRESH_COOKIE_NAME in request.COOKIES:
            auth_data.update(refresh=request.COOKIES[JWT_REFRESH_COOKIE_NAME])
        serializer = self.get_serializer(data=auth_data)

        try:
            serializer.is_valid(raise_exception=False)
        except AuthenticationFailed as e:
            return Response({'access': None,
                             'authenticated': False,
                             'message': str(e)},
                            status=status.HTTP_200_OK)
        except jwt_exc.TokenError as e:
            raise jwt_exc.InvalidToken(e.args[0])

        data = serializer.validated_data

        response = Response({'access': data.get('access', None),
                             "authenticated": 'access' in data,
                             "message": "ok"},
                            status=status.HTTP_200_OK)

        if 'refresh' in data:
            response.set_cookie(JWT_REFRESH_COOKIE_NAME, data['refresh'],
                                max_age=settings.api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
                                path='/api/token/refresh/',
                                httponly=True,
                                domain=request.get_host().split(':')[0],
                                )
        # if 'access' in data:
        #     # update last visit when obtain or refresh token
        #
        #     # todo JWT token has outdated last visit data in it....
        #     User.objects.filter(Q(username__iexact=auth_data.get('username')) |
        #                         Q(email__iexact=auth_data.get('username'))).update(last_visit=now())

        # todo path for refresh cookie should be setting constant

        return response


class TokenObtainPairView(BaseTokenView):
    serializer_class = TokenObtainPairSerializer


class TokenRefreshView(BaseTokenView):
    serializer_class = serializers.TokenRefreshSerializer


class TokenRemoveView(APIView):
    def post(self, request):
        response = Response({"message": "removed"})

        response.delete_cookie(JWT_REFRESH_COOKIE_NAME,
                               path='/api/token/refresh/',
                               domain=request.get_host().split(':')[0])

        return response


class ActivateView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()

            return Response({"message": "success"})
        else:
            return Response({"message": "failure"})
