# from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', include('chess_db.urls')),
    path('api/', include('users.urls')),
    path('api/', include('blog.urls')),
    path('api/', include('chess_openings.urls'))
]
