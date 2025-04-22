from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # auth and user endpoints
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path("api/v1/auth/register/", include("dj_rest_auth.registration.urls")),
    # expenses endpoints
    path("api/v1/", include("api.expenses.urls")),
]
