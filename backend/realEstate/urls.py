
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
    path('property/delete/<int:property_id>',views.delete_property),
    path('property/update/<int:property_id>',views.update_property),

    path('property/like/<int:id>',views.toggle_like),
    path('property/is_liked/<int:id>',views.is_liked),

    path('profile/<int:prof_id>/properties',views.profile_properties),

    path('profile/<int:prof_id>',views.show_profile),
    path('profile/me/',views.my_profile),
    path('profile/create/',views.create_profile),
    path('profile/update/',views.update_profile),

    path("agents/", views.get_all_agents),
    
    path('get_requests/',views.get_requests),
    path('my_requests/',views.get_my_sent_requests),

    path('property/submit_req/<int:property_id>',views.submit_request),

    path('requests/<int:req_id>/rejected/',views.reject_request),
    path('requests/<int:req_id>/approved/',views.approve_request),
    path('requests/<int:req_id>/completed/',views.complete_request),
    
    path('reviews/<int:agent_id>',views.get_reviews),
    path('review/create/<int:agent_id>',views.create_review),
    path('review/delete/',views.delete_review),
    
]