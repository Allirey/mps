from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils.translation import gettext_lazy as _
from .validators import UnicodeUsernameValidator


class CaseInsensitiveUserManager(UserManager):
    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD + '__iexact': username})


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()

    username = models.CharField(_('username'), max_length=32, unique=True,
                                help_text=_('Required. 32 characters or fewer. Letters, digits and _ only.'),
                                validators=[username_validator],
                                error_messages={'unique': _("Username already in use."), }, )

    email = models.EmailField(_('email address'), unique=True,
                              error_messages={'unique': _("Email already in use."), })
    is_active = models.BooleanField(_('active'), default=False, help_text=_(
        'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.'
    ), )
    last_visit = models.DateTimeField(auto_now_add=True)

    objects = CaseInsensitiveUserManager()
