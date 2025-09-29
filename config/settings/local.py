from .base import *

# 開発環境向けのデータベース設定 (PostgreSQLを使用する場合)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fashion_rental_db',
        'USER': 'postgres',
        'PASSWORD': 'Uasu214v',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# 開発中に便利な追加アプリ
# (本番環境では不要な場合があるため、base.pyではなくこちらに記述)
INSTALLED_APPS += [
    'debug_toolbar',
    'django_extensions',
]
MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]
# 静的ファイルの設定（開発用）
# (本番環境とは異なるため、こちらに記述)
STATIC_URL = '/static/'

# メディアファイルの設定（開発用）
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'