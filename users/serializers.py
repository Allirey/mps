import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as TokenObtainSerializerNative
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from .models import User
from .utils import normalize_email


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance

    def validate_password(self, password):
        # todo complete password validation
        if len(password) < 6:
            raise serializers.ValidationError(_(u'Password should be at least 6 characters'))

        return password

    def validate_username(self, username):
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(_(u'Username already in use.'))

        return username

    def validate_email(self, email):
        email = normalize_email(email)
        name, domain = email.split('@')

        if not bool(re.compile(r'^[\w.]+$').match(name)):
            raise serializers.ValidationError(_(u'Enter valid email address.'
                                                u' Allowed latin letters, numbers and _ .'))

        if domain not in settings.ALLOWED_EMAIL_DOMAINS:
            raise serializers.ValidationError(_(u'{} not supported. Try gmail.com, or similar'.format(domain)))

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(_(u'Email already in use.'))

        return email


class PasswordResetChangeSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(_(u"Password fields didn't match."))

        return attrs

    def validate_password(self, password):
        if len(password) < 6:
            raise serializers.ValidationError(_(u'Password should be at least 6 characters'))

        return password

    def save(self, **kwargs):
        password = self.validated_data['password']
        user = User.objects.get(pk=self.initial_data['id'])
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(PasswordResetChangeSerializer):
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(_(u'Old password is not correct.'))
        return value

    def save(self, **kwargs):
        password = self.validated_data['password']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user


class TokenObtainPairSerializer(TokenObtainSerializerNative):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['date_joined'] = user.date_joined.isoformat()
        # ...

        return token
