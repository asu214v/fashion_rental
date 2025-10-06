import os
from pathlib import Path

# プロジェクトのルートディレクトリを定義
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# セキュリティキー（本番環境では必ず環境変数に設定！）
SECRET_KEY = 'django-insecure-your-secret-key'

# デバッグモードの設定 (ローカル環境で上書きされる)
DEBUG = True

# アクセスを許可するホスト
ALLOWED_HOSTS = []

# アプリケーションの登録
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    # ここに自分で作ったアプリを登録
    'users.apps.UsersConfig',
    'items.apps.ItemsConfig',
    'rental.apps.RentalConfig',
    'chat.apps.ChatConfig',
    'home.apps.HomeConfig',
    'notification.apps.NotificationConfig',
    'favorite.apps.FavoriteConfig',
    'schedule.apps.ScheduleConfig',
    'hamburger.apps.HamburgerConfig', 
    'accounts.apps.AccountsConfig',  
]

# ミドルウェアの設定
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL設定
ROOT_URLCONF = 'config.urls'

# テンプレート設定
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')], # 共通テンプレート用
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

# ASGI/WSGI 設定 (ChannelsとWebサーバーの連携)
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# チャンネルレイヤーの設定（開発環境用）
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

# 本番環境ではRedisを使用
# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [('127.0.0.1', 6379)],
#         },
#     },
# }

# 認証設定
AUTH_PASSWORD_VALIDATORS = [
    # パスワードのバリデーションルール
]

# 言語とタイムゾーン
LANGUAGE_CODE = 'ja'
TIME_ZONE = 'Asia/Tokyo'
USE_I18N = True
USE_TZ = True

# 静的ファイル設定
STATIC_URL = 'static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')] # 共通静的ファイル用

# メディアファイル設定
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# モデルのデフォルト設定
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'   # ログイン後のリダイレクト先
LOGOUT_REDIRECT_URL = '/' 