from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from .models import User
from .utils import normalize_email
# from django.utils.timezone import now


class EmailModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):

        if not ('@' in username and password):
            return None

        try:
            email = normalize_email(username)
            user = User.objects.get(Q(email__iexact=email))

        except User.DoesNotExist:
            User().set_password(password)

        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                # todo update last_visit and test how it work
                # user.last_visit = now()

                return user
