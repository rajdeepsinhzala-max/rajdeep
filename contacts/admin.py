from django.contrib import admin
from .models import ContactInquiry, ResumeDownload, Testimonial, Subscriber, ProjectCaseStudy, BlogCategory, BlogPost, Lead, Feedback


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'subject', 'service', 'ip_address', 'created_at')
    search_fields = ('name', 'email', 'subject', 'ip_address')
    list_filter = ('service', 'created_at')
    readonly_fields = ('created_at', 'ip_address')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'company', 'rating', 'is_active', 'created_at')
    list_filter = ('is_active', 'rating', 'created_at')
    search_fields = ('name', 'role', 'company', 'text')
    readonly_fields = ('created_at',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'rating', 'status', 'ip_address', 'created_at')
    list_filter = ('status', 'rating', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at', 'ip_address')
    actions = ['approve_feedback', 'reject_feedback']

    def approve_feedback(self, request, queryset):
        for item in queryset:
            item.status = 'approved'
            item.save()
        self.message_user(request, f"{queryset.count()} feedbacks approved successfully.")
    approve_feedback.short_description = "Approve selected feedbacks"

    def reject_feedback(self, request, queryset):
        for item in queryset:
            item.status = 'rejected'
            item.save()
        self.message_user(request, f"{queryset.count()} feedbacks rejected successfully.")
    reject_feedback.short_description = "Reject selected feedbacks"


@admin.register(ResumeDownload)
class ResumeDownloadAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'downloaded_at', 'user_agent')
    list_filter = ('downloaded_at',)
    search_fields = ('ip_address', 'user_agent')
    readonly_fields = ('downloaded_at', 'ip_address', 'user_agent')


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'date_joined')
    list_filter = ('date_joined',)
    search_fields = ('email',)
    readonly_fields = ('date_joined',)


@admin.register(ProjectCaseStudy)
class ProjectCaseStudyAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'views_count', 'order', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'problem', 'solution', 'result')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'views_count')


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'views_count', 'is_published', 'created_at')
    list_filter = ('category', 'is_published', 'created_at')
    search_fields = ('title', 'summary', 'content', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at', 'views_count')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'source', 'is_qualified', 'ip_address', 'created_at')
    list_filter = ('source', 'is_qualified', 'created_at')
    search_fields = ('name', 'email', 'phone', 'source', 'details', 'ip_address')
    readonly_fields = ('created_at', 'ip_address', 'referrer', 'scroll_depth', 'time_on_site')



