from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt import (serializers, settings as jwt_settings, authentication as jwt_auth,
                                      exceptions as jwt_exc)

from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth import get_user_model
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
# from django.utils.timezone import now
# from django.db.models import Q

from .serializers import (UserCreateSerializer, TokenObtainPairSerializer, ChangePasswordSerializer,
                          PasswordResetChangeSerializer)
from .tokens import token_generator
from .tasks import send_verification_email, send_password_reset_link
from .utils import normalize_email

User = get_user_model()


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

        response.set_cookie(settings.JWT_REFRESH_COOKIE_NAME, str(refresh),
                            max_age=jwt_settings.api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
                            path=settings.JWT_REFRESH_COOKIE_PATH,
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

        if settings.JWT_REFRESH_COOKIE_NAME in request.COOKIES:
            auth_data.update(refresh=request.COOKIES[settings.JWT_REFRESH_COOKIE_NAME])
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
            response.set_cookie(settings.JWT_REFRESH_COOKIE_NAME, data['refresh'],
                                max_age=jwt_settings.api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
                                path=settings.JWT_REFRESH_COOKIE_PATH,
                                httponly=True,
                                domain=request.get_host().split(':')[0],
                                )
        # if 'access' in data:
        #     # update last visit when obtain or refresh token
        #
        #     User.objects.filter(Q(username__iexact=auth_data.get('username')) |
        #                         Q(email__iexact=auth_data.get('username'))).update(last_visit=now())

        return response


class TokenObtainPairView(BaseTokenView):
    serializer_class = TokenObtainPairSerializer


class TokenRefreshView(BaseTokenView):
    serializer_class = serializers.TokenRefreshSerializer


class TokenRemoveView(APIView):
    def post(self, request):
        response = Response({"message": "removed"})

        response.delete_cookie(settings.JWT_REFRESH_COOKIE_NAME,
                               path=settings.JWT_REFRESH_COOKIE_PATH,
                               domain=request.get_host().split(':')[0])

        return response


class ActivateView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and token_generator.check_token(user, token):
            user.is_active = True
            user.save()

            return Response({"message": "success"})
        else:
            return Response({"message": "failure"})


class SendPasswordResetLinkView(APIView):
    def post(self, request):
        email = normalize_email(request.data.get('email'))

        if not User.objects.filter(email=email).exists():
            return Response({"status": 404, "message": "There is no account with that username or email"},
                            status=status.HTTP_200_OK)

        user = User.objects.get(email=email)
        scheme = self.request.scheme
        domain = self.request.get_host()
        send_password_reset_link.delay(user.id, scheme, domain)

        return Response({"status": 200, "message": "ok"}, status=status.HTTP_200_OK)


class PasswordResetChangeView(generics.GenericAPIView):
    serializer_class = PasswordResetChangeSerializer

    def post(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and token_generator.check_token(user, token):
            # todo create Token model, with expiration date 24 hours
            request.data.update(id=user.id)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({"status": 200, "message": "success"}, status.HTTP_200_OK)
        else:
            return Response({"status": 400, "message": "token incorrect or expired"}, status.HTTP_200_OK)
