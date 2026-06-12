import os
from pathlib import Path
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-default-secret-key-12345")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "True").strip() == "True"

ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'corsheaders',
    
    # Local apps
    'contacts.apps.ContactsConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Put CorsMiddleware as high up as possible
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portfolio_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio_backend.wsgi.application'

# Database
# Connects to MySQL using PyMySQL driver. Falls back to SQLite if MySQL is not available or if running on Vercel.
IS_VERCEL = "VERCEL" in os.environ

DB_NAME = os.getenv("DB_NAME", "portfolio_db")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")

MYSQL_AVAILABLE = False

if not IS_VERCEL:
    try:
        import pymysql
        # Attempt a quick connection to check if MySQL is running
        conn = pymysql.connect(
            host=DB_HOST,
            port=int(DB_PORT),
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=2
        )
        # Automatically create database if it doesn't exist
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.close()
        conn.close()
        MYSQL_AVAILABLE = True
    except Exception as e:
        print(f"\n[WARNING] MySQL connection failed: {e}")
        print("[INFO] Falling back to local SQLite database so the server can run without active MySQL!\n")
else:
    print("[INFO] Running on Vercel: Bypassing MySQL and using SQLite automatically.")

if MYSQL_AVAILABLE:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Headers Settings (To support REST calls from browser)
CORS_ALLOW_ALL_ORIGINS = True  # Allowed for local file browser testing
CORS_ALLOW_CREDENTIALS = True
