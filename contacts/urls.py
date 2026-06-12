from django.urls import path
from django.views.generic import TemplateView
from .views import (
    contact_api, home_view, contact_view, visitor_count_api, track_resume_download,
    chatbot_api, feedback_api, newsletter_subscribe_api, track_project_view_api,
    blog_list_view, blog_detail_view, admin_analytics_view, sitemap_view,
    api_create_lead
)

urlpatterns = [
    path('', home_view, name='home'),
    path('contact/', contact_view, name='contact_page'),
    path('api/contact/', contact_api, name='contact_api'),
    path('api/visitor-count/', visitor_count_api, name='visitor_count_api'),
    path('api/track-resume/', track_resume_download, name='track_resume_download'),
    path('api/chatbot/', chatbot_api, name='chatbot_api'),
    path('api/feedback/', feedback_api, name='feedback_api'),
    path('api/newsletter/subscribe/', newsletter_subscribe_api, name='newsletter_subscribe_api'),
    path('api/projects/<slug:slug>/view/', track_project_view_api, name='track_project_view'),
    path('blog/', blog_list_view, name='blog_list'),
    path('blog/<slug:slug>/', blog_detail_view, name='blog_detail'),
    path('admin/analytics/', admin_analytics_view, name='admin_analytics'),
    path('api/leads/create/', api_create_lead, name='api_create_lead'),
    
    # SEO robots and static elements
    path('robots.txt', TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path('sitemap.xml', sitemap_view, name='sitemap'),
]
