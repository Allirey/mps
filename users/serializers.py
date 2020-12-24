from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as TokenObtainSerializerNative

from .models import User


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance


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
