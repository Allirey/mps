from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import AUTH_HEADER_TYPES
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.mixins import UserPassesTestMixin

from .serializers import UserCreateSerializer, TokenObtainPairSerializer

JWT_REFRESH_COOKIE_NAME = 'rt'


class UserCreateView(UserPassesTestMixin, generics.CreateAPIView):
    # todo account activation via link send by sendgrid/gmail service
    # todo captcha (google recaptcha or similar)
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserCreateSerializer

    def test_func(self):
        return str(self.request.user) == 'AnonymousUser'


class Protected(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(data={'type': 'protected'})


class BaseTokenView(generics.GenericAPIView):
    permission_classes = ()
    authentication_classes = ()

    serializer_class = None

    www_authenticate_realm = 'api'

    def get_authenticate_header(self, request):
        return '{0} realm="{1}"'.format(
            AUTH_HEADER_TYPES[0],
            self.www_authenticate_realm,
        )

    def post(self, request, *args, **kwargs):
        data = request.data

        # todo 'JWT_REFRESH_COOKIE' should be setting constant

        if JWT_REFRESH_COOKIE_NAME in request.COOKIES:
            data.update(refresh=request.COOKIES[JWT_REFRESH_COOKIE_NAME])
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=False)
        except TokenError as e:

            raise InvalidToken(e.args[0])

        data = serializer.validated_data

        # todo find better solution to hide 4xx errors in browser console on frontend when refreshing tokens
        response = Response({'access': data.get('access', None),
                             "code": 200 if 'access' in data else 401},
                            status=status.HTTP_200_OK)

        if 'refresh' in data:
            response.set_cookie(JWT_REFRESH_COOKIE_NAME, data['refresh'],
                                max_age=api_settings.REFRESH_TOKEN_LIFETIME.total_seconds(),
                                path='/api/token/refresh/',
                                httponly=True,
                                domain=request.get_host().split(':')[0],
                                )

        # todo path for refresh cookie should be setting constant

        return response


class TokenObtainPairView(BaseTokenView):
    serializer_class = TokenObtainPairSerializer


class TokenRefreshView(BaseTokenView):
    serializer_class = TokenRefreshSerializer


class TokenRemoveView(APIView):
    def post(self, request):
        response = Response({"message": "removed"})

        response.delete_cookie(JWT_REFRESH_COOKIE_NAME,
                               path='/api/token/refresh/',
                               domain=request.get_host().split(':')[0])

        return response
