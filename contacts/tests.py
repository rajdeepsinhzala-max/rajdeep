import json
from django.test import TestCase, Client
from django.urls import reverse
from .models import Subscriber, ProjectCaseStudy, BlogCategory, BlogPost, Visitor

class PortfolioAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        
        # Create test project
        self.project = ProjectCaseStudy.objects.create(
            name="Test Project",
            slug="test-project",
            problem="Test problem detail description.",
            solution="Test solution detail description.",
            technologies="Python, Django",
            features="Feature 1\nFeature 2",
            result="Excellent test outcome.",
            category="django"
        )
        
        # Create test blog category and post
        self.category = BlogCategory.objects.create(
            name="Tech Tips",
            slug="tech-tips"
        )
        self.post = BlogPost.objects.create(
            title="Test Post Title",
            slug="test-post-title",
            category=self.category,
            summary="A short summary of the post.",
            content="Markdown content goes here.",
            tags="Python,Django",
            is_published=True
        )

    def test_chatbot_faq_fallback(self):
        url = reverse('chatbot_api')
        # Test empty message
        response = self.client.post(url, data=json.dumps({"message": ""}), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        
        # Test who is rajdeep query
        response = self.client.post(url, data=json.dumps({"message": "Who is Rajdeep?"}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn("Rajdeepsinh Zala", data["reply"])

        # Test random query
        response = self.client.post(url, data=json.dumps({"message": "What is the capital of France?"}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn("I specialize in Rajdeep's portfolio", data["reply"])

    def test_newsletter_subscription(self):
        url = reverse('newsletter_subscribe_api')
        
        # Valid subscription
        response = self.client.post(url, data=json.dumps({"email": "test@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertEqual(data["subscriber_count"], 166) # baseline (165) + 1
        
        # Duplicate subscription
        response = self.client.post(url, data=json.dumps({"email": "test@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        
        # Invalid email
        response = self.client.post(url, data=json.dumps({"email": "not-an-email"}), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_track_project_view(self):
        url = reverse('track_project_view', kwargs={'slug': self.project.slug})
        
        self.assertEqual(self.project.views_count, 0)
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        
        # Refresh and assert view count
        self.project.refresh_from_db()
        self.assertEqual(self.project.views_count, 1)

    def test_visitor_count(self):
        url = reverse('visitor_count_api')
        
        # Get count
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        initial_visitors = data["total_visitors"]
        
        # Post visit
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["total_visitors"], initial_visitors + 1)

    def test_blog_views(self):
        # Blog list
        url_list = reverse('blog_list')
        response = self.client.get(url_list)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.post.title)
        
        # Blog detail
        url_detail = reverse('blog_detail', kwargs={'slug': self.post.slug})
        response = self.client.get(url_detail)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.post.title)

    def test_create_lead_api(self):
        url = reverse('api_create_lead')
        
        # 1. Test qualified lead by budget
        payload = {
            "name": "Test Lead 1",
            "email": "lead1@example.com",
            "phone": "+919876543210",
            "source": "quick_quote",
            "details": {
                "budget": "500",
                "message": "Need python django project."
            },
            "scroll_depth": 75,
            "time_on_site": 120
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertTrue(data["is_qualified"])
        
        # 2. Test qualified lead by service keyword
        payload = {
            "name": "Test Lead 2",
            "email": "lead2@example.com",
            "source": "consultation",
            "details": {
                "service_type": "Django Backend Development",
                "budget": "100" # budget is low but tech qualifies it!
            }
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertTrue(data["is_qualified"])

        # 3. Test unqualified lead
        payload = {
            "name": "Test Lead 3",
            "email": "lead3@example.com",
            "source": "exit_intent",
            "details": {
                "budget": "150",
                "service": "Static portfolio page layout"
            }
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertFalse(data["is_qualified"])
        
        # 4. Test validation missing fields
        payload = {
            "name": "",
            "email": "missing@example.com",
            "source": "hire_me_popup"
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_feedback_api_success(self):
        url = reverse('feedback_api')
        payload = {
            "name": "Alex Feedbacker",
            "email": "alex@example.com",
            "rating": 5,
            "message": "Outstanding portfolio layout and backend telemetry!",
            "feedback_honeypot": ""
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertIn("submitted for admin approval", data["message"])

    def test_feedback_api_validation(self):
        url = reverse('feedback_api')
        # Missing fields
        payload = {
            "name": "Alex",
            "email": "",
            "rating": 5,
            "message": "Missing email"
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Rating out of bounds
        payload = {
            "name": "Alex",
            "email": "alex@example.com",
            "rating": 10,
            "message": "Out of bounds rating"
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Invalid email format
        payload = {
            "name": "Alex",
            "email": "not-an-email",
            "rating": 4,
            "message": "Invalid email"
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_feedback_api_spam_honeypot(self):
        url = reverse('feedback_api')
        payload = {
            "name": "Spambot",
            "email": "bot@spam.com",
            "rating": 5,
            "message": "Buy something!",
            "feedback_honeypot": "should_be_empty_but_filled"
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        # Spam protection returns 201 to fool the bot, but does NOT store it.
        self.assertEqual(response.status_code, 201)

    def test_chatbot_api_with_history(self):
        url = reverse('chatbot_api')
        payload = {
            "message": "What is Python?",
            "history": [
                {"role": "user", "text": "Hi"},
                {"role": "model", "text": "Hello, I am Rajdeep's AI Assistant. How can I help you today?"}
            ]
        }
        response = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue("reply" in data)
