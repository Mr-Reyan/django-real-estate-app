
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from . import views


urlpatterns = [
    path('register/',views.register_view),
    path('token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('token/refresh/',TokenRefreshView.as_view(),name="token_refresh_pair"),
    path('user/', views.current_user),
    path('property/',views.view_properties),

    path('property/<int:id>',views.property_detail),
    
    path('property/create/',views.create_property),
    path('property/delete/',views.delete_property),
    path('property/update/',views.update_property),
    path('property/like/<int:id>',views.toggle_like),
    path('property/is_liked/<int:id>',views.is_liked),
    path('profile/create/',views.create_profile),
    path('profile/update/',views.update_profile),

    path("agents/", views.get_all_agents),

    path('profile/me/',views.my_profile),
    path('profile/<int:prof_id>',views.show_profile),
    
    path('property/submit_req/<int:property_id>',views.submit_request),
    path('property/get_requests/<int:property_id>',views.get_requests),
    path('property/reject_requests/<int:property_id>',views.reject_request),
    path('property/approve_requests/<int:property_id>',views.approve_request),
    
    
]