from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from celery import shared_task
from .tokens import account_activation_token
from django.conf import settings


@shared_task
def send_verification_email(user_id, scheme, domain, email_template=None):
    User = get_user_model()

    try:
        user = User.objects.get(pk=user_id)
        kwargs = {
            'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user)
        }
        # todo find smart solution to store url in settings or .env file to frontend activate page
        if settings.DEBUG:
            activation_link = f'{scheme}://{domain.split(":")[0]}{":3000"}/' \
                          f'accounts/confirm-email/{kwargs["uidb64"]}/{kwargs["token"]}/'
        else:
            activation_link = f'https://glitcher.org/accounts/confirm-email/{kwargs["uidb64"]}/{kwargs["token"]}/'

        subject = 'Activate account'

        if email_template:
            text = render_to_string(email_template,
                                    {'scheme': scheme, 'domain': domain, 'activation_url': 'url', 'user': user})
        else:
            text = f"""
Welcome {user.username}!

Thanks for signing up with glitcher.org!
You must follow this link to activate your account:
{activation_link}

Have fun, and don't hesitate to contact me with your feedback.
            """

        user.email_user(subject, text)
    except User.DoesNotExist as e:
        print(e)
