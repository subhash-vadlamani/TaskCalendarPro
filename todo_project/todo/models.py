from django.db import models
import datetime
from django.contrib.auth.models import User

# Named function to get the default user


def get_default_user():
    return User.objects.get_or_create(username='dummy_user', defaults={'email': 'dummy@example.com', 'password': 'password'})[0].id


class Task(models.Model):
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    date_created = models.DateField(default=datetime.date.today)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='tasks',
        default=get_default_user  # Using the named function
    )

    def __str__(self):
        return self.title
