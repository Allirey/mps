from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as TokenObtainSerializerNative
from django.utils.translation import ugettext_lazy as _

from .models import User


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
            raise serializers.ValidationError(_(u'Username already in use'))

        elif len(username) < 3:
            raise serializers.ValidationError(_(u'Username too short'))

        return username

    def validate_email(self, email):
        email = email.lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(_(u'Email already in use'))

        # todo supported email should be in settings
        if not (email.split('@')[1] in ['gmail.com', 'mail.ru', 'protonmail.com', 'yahoo.com', 'googlemail.com',
                                        'zoho.com', 'hotmail.com', 'live.com', 'msn.com', 'aol.com', 'yandex.ru', ]):
            raise serializers.ValidationError(_(u'{} not supported'.format(email.split('@')[1])))

        return email


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
        token['last_visit'] = user.last_visit.isoformat()
        # ...

        return token
