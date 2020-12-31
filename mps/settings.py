import os
import environ
from datetime import timedelta

environ.Env.read_env()
env = environ.Env()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = env("SECRET_KEY")
DEBUG = True

ALLOWED_HOSTS = ['*']
# ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '10.10.86.217']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'users.apps.UsersConfig',
    'quizy.apps.QuizyConfig',
    'chess_db.apps.ChessConfig',
    'blog.apps.BlogConfig',
    'rest_framework',

    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'mps.user_activity_middleware.UserActivityMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mps.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mps.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env("POSTGRES_DB"),
        'USER': env("POSTGRES_USER"),
        'PASSWORD': env("POSTGRES_PASSWORD"),
        'HOST': env("POSTGRES_HOST"),
        'PORT': env("POSTGRES_PORT")
    }
}
import django.contrib.auth.password_validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
CORS_ALLOW_CREDENTIALS = True

# CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://glitcher.org',
    'http://10.10.86.217:3000',
    'http://10.10.86.217:5000',
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True
USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication'
    ),
}
AUTH_USER_MODEL = 'users.User'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': True,
}

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'users.backends.EmailModelBackend'
]

EMAIL_BACKEND = f'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True

CELERY_BROKER_URL = 'pyamqp://rabbitmq:5672'


ALLOWED_EMAIL_DOMAINS = [
    "fide.com",  # https://check-mail.org/domain/fide.com/ says DISPOSABLE / TEMPORARY DOMAIN
    # Default domains included
    "aol.com", "att.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com", "google.com", "hotmail.com",
    "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com", "live.com", "sbcglobal.net", "verizon.net",
    "yahoo.com", "yahoo.co.uk", "protonmail.com", "protonmail.ch", "pm.me",
    # Other global domains
    "email.com", "games.com", "gmx.net", "hush.com", "hushmail.com", "icloud.com", "inbox.com", "lavabit.com",
    "love.com", "outlook.com", "pobox.com", "rocketmail.com", "safe-mail.net", "wow.com", "ygm.com", "ymail.com",
    "zoho.com", "fastmail.com", "fastmail.fm", "yandex.com",
    # United States ISP domains
    "bellsouth.net", "charter.net", "comcast.net", "cox.net", "earthlink.net", "juno.com",
    # Canadian ISP domains
    "yahoo.ca",
    # British ISP domains
    "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk", "ntlworld.com",
    "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk", "virgin.net", "wanadoo.co.uk", "bt.com",
    # Domains used in Asia
    "sina.com", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr",
    "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph",
    # French ISP domains
    "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr",
    "free.fr",
    # German ISP domains
    "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de", "web.de", "yahoo.de",
    # Russian ISP domains
    "mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",
    # Belgian ISP domains
    "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",
    # Argentinian ISP domains
    "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",
    # Domains used in Mexico
    "yahoo.com.mx", "live.com.mx", "hotmail.es", "hotmail.com.mx", "prodigy.net.mx",
    # Domains used in Brazil
    "yahoo.com.br", "hotmail.com.br", "outlook.com.br", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br",
    "itelefonica.com.br", "r7.com", "zipmail.com.br", "globo.com", "globomail.com", "oi.com.br",
    # Domains without an A record
    "cabletv.on.ca", "live.ca", "unitybox.de", "volki.at"
]
