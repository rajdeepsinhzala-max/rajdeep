# Portfolio Django Backend & WhatsApp Notification Server

This is the robust **Django backend server** for your portfolio. It connects your "Contact Us" form to a **MySQL database** using the pure-Python `PyMySQL` driver, logs inquiries via Django ORM models, and automatically triggers a **WhatsApp confirmation message** to visitors.

---

## Key Advantages of Django
- **Django Admin Panel:** Out-of-the-box UI to browse, filter, search, and manage your contact submissions.
- **Robust Database ORM:** High-performance queries and migrations, fully managed via Python models.
- **Fail-Safe Mock Mode:** If database credentials or Twilio tokens are missing, the server falls back to "mock mode"—logging messages directly to your console, allowing you to test out the forms instantly.

---

## 🛠️ Step-by-Step Installation

### 1. Install Dependencies
Open your terminal inside the `portfolio_backend` directory, and run:
```bash
pip install -r requirements.txt
```
This installs the required pure-Python packages: `Django`, `django-cors-headers`, `PyMySQL`, `cryptography`, `requests`, and `python-dotenv`.

### 2. Configure Your Database
Ensure your local MySQL server is active (e.g. via **XAMPP**, **WampServer**, or direct service).

Open the `.env` file and verify your credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
```
*Note: If no password is set for your `root` MySQL user, leave `DB_PASSWORD=` blank.*

### 3. Run Database Migrations
Run these standard Django commands to create your database tables automatically:
```bash
python manage.py makemigrations
python manage.py migrate
```
This will automatically generate the `portfolio_db` schema (if it doesn't exist) and build the `contact_inquiries` table!

### 4. Create an Admin Account (Optional)
To browse your inquiries inside Django's gorgeous admin panel, create a superuser:
```bash
python manage.py createsuperuser
```
Follow the prompts to set up your username, email, and password.

### 5. Configure Twilio WhatsApp (Optional)
To send real WhatsApp messages to visitors:
1. Log in or sign up at [Twilio.com](https://www.twilio.com).
2. Grab your **Account SID** and **Auth Token** from your console.
3. Activate the WhatsApp Sandbox under the **Messaging > Try it Out > Send a WhatsApp Message** menu.
4. Add these credentials to your `.env` file:
   ```env
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

---

## 🚀 How to Run the Server

Simply run the following command in your terminal:
```bash
python manage.py runserver
```

The server will start listening on **`http://127.0.0.1:8000`**.

Open your `contact.html` in your browser, fill out your details (including phone number), and hit **Submit** to test the integration!

---

## 🔒 Accessing the Django Admin Panel

1. Ensure the server is running (`python manage.py runserver`).
2. Navigate to **`http://127.0.0.1:8000/admin/`** in your browser.
3. Log in with your superuser credentials.
4. If you want to see inquiries in the admin panel, register it inside `contacts/admin.py`:
   ```python
   from django.contrib import admin
   from .models import ContactInquiry

   @admin.register(ContactInquiry)
   class ContactInquiryAdmin(admin.ModelAdmin):
       list_display = ('name', 'email', 'phone', 'subject', 'service', 'created_at')
       search_fields = ('name', 'email', 'subject')
       list_filter = ('service', 'created_at')
   ```
