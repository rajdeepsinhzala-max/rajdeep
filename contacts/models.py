from django.db import models


class ContactInquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    subject = models.CharField(max_length=255)
    service = models.CharField(max_length=255)
    message = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_inquiries'  # Explicitly matches the MySQL table name

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Feedback(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField()
    rating = models.IntegerField(default=5)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portfolio_feedbacks'
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback from {self.name} ({self.status})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # If status is approved, create/update Testimonial
        if self.status == 'approved':
            testimonial, created = Testimonial.objects.get_or_create(
                feedback=self,
                defaults={
                    'name': self.name,
                    'role': 'Client Feedback',
                    'company': '',
                    'text': self.message,
                    'rating': self.rating,
                    'is_active': True
                }
            )
            if not created:
                testimonial.name = self.name
                testimonial.text = self.message
                testimonial.rating = self.rating
                testimonial.is_active = True
                testimonial.save()
        else:
            # If status is not approved, set active=False on testimonial
            Testimonial.objects.filter(feedback=self).update(is_active=False)


class Testimonial(models.Model):
    feedback = models.OneToOneField(Feedback, on_delete=models.CASCADE, null=True, blank=True, related_name='testimonial')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField()
    rating = models.IntegerField(default=5)
    image_url = models.URLField(blank=True, null=True, help_text="Optional profile image URL")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portfolio_testimonials'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.role}"


class Visitor(models.Model):
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portfolio_visitors'

    def __str__(self):
        return f"Visitor from {self.ip_address} at {self.visited_at}"


class ResumeDownload(models.Model):
    downloaded_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'resume_downloads'
        verbose_name = 'Resume Download'
        verbose_name_plural = 'Resume Downloads'

    def __str__(self):
        return f"Download by {self.ip_address} on {self.downloaded_at}"


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'newsletter_subscribers'
        verbose_name = 'Subscriber'
        verbose_name_plural = 'Subscribers'

    def __str__(self):
        return self.email


class ProjectCaseStudy(models.Model):
    CATEGORY_CHOICES = [
        ('django', 'Django'),
        ('php', 'PHP'),
        ('python', 'Python'),
        ('fullstack', 'Full Stack'),
    ]
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    problem = models.TextField()
    solution = models.TextField()
    technologies = models.CharField(max_length=255, help_text="Comma-separated values")
    features = models.TextField(help_text="Newline-separated values")
    result = models.TextField()
    github_link = models.URLField(max_length=500, blank=True, null=True)
    live_link = models.URLField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='fullstack')
    views_count = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_case_studies'
        verbose_name = 'Project Case Study'
        verbose_name_plural = 'Project Case Studies'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        db_table = 'blog_categories'
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name='posts')
    summary = models.CharField(max_length=500)
    content = models.TextField(help_text="Markdown content supported")
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated values")
    meta_description = models.CharField(max_length=255, blank=True, help_text="SEO Meta Description")
    image_url = models.URLField(max_length=500, blank=True, null=True)
    views_count = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_posts'
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Lead(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default='')
    source = models.CharField(max_length=100) # e.g. 'whatsapp_cta', 'consultation', 'quick_quote', 'hire_me_popup', 'exit_intent', etc.
    details = models.TextField(blank=True, default='', help_text="JSON metadata string")
    is_qualified = models.BooleanField(default=False)
    referrer = models.CharField(max_length=500, blank=True, default='')
    scroll_depth = models.IntegerField(default=0)
    time_on_site = models.IntegerField(default=0) # in seconds
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portfolio_leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.source}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"



