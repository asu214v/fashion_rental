from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),  # 新規登録
    path("login/", auth_views.LoginView.as_view(template_name="accounts/login.html"), name="login"),  # ログイン
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),  # ログアウト
]
