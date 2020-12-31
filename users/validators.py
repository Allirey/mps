from django.core import validators
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class UnicodeUsernameValidator(validators.RegexValidator):
    regex = r'^[\w]{2,32}\Z'
    message = _(
        'Enter a valid username. It may contain latin letters, '
        'numbers, and _ , with 2-32 characters.'
    )
    flags = 0
