from django.apps import AppConfig
import sys

class ContactsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contacts'

    def ready(self):
        # Only trigger migration checks when running the server
        if 'runserver' in sys.argv:
            from django.core.management import call_command
            try:
                print("[INFO] Automatically running Django migrations on startup...")
                call_command('migrate', interactive=False)
                print("[SUCCESS] Migrations completed successfully!")
            except Exception as e:
                print(f"[ERROR] Auto-migration failed on startup: {e}")

