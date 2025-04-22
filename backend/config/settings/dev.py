from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True
ACCOUNT_EMAIL_VERIFICATION = "none"
CORS_ALLOW_CREDENTIALS = True

# cookie in dev
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
SIMPLE_JWT["AUTH_COOKIE_SECURE"] = False
REST_AUTH["JWT_AUTH_SECURE"] = False

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
