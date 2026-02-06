from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Create sample users for testing'

    def handle(self, *args, **kwargs):
        if not CustomUser.objects.filter(username='admin').exists():
            admin = CustomUser.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin.username}'))
        
        if not CustomUser.objects.filter(username='manager1').exists():
            manager = CustomUser.objects.create_user(
                username='manager1',
                email='manager1@example.com',
                password='manager123',
                first_name='John',
                last_name='Manager',
                role='manager'
            )
            self.stdout.write(self.style.SUCCESS(f'Created manager user: {manager.username}'))
        
        if not CustomUser.objects.filter(username='user1').exists():
            user = CustomUser.objects.create_user(
                username='user1',
                email='user1@example.com',
                password='user123',
                first_name='Jane',
                last_name='Developer',
                role='user'
            )
            self.stdout.write(self.style.SUCCESS(f'Created regular user: {user.username}'))
        
        self.stdout.write(self.style.SUCCESS('\nSample users created successfully!'))
        self.stdout.write('Admin: username=admin, password=admin123')
        self.stdout.write('Manager: username=manager1, password=manager123')
        self.stdout.write('User: username=user1, password=user123')
