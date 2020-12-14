from django.contrib.auth.backends import ModelBackend
from .models import User


class EmailModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):

        if '@' in username and password:
            kwargs = {'email': username}
        else:
            return None

        try:
            user = User.objects.get(**kwargs)

        except User.DoesNotExist:
            User().set_password(password)

        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
