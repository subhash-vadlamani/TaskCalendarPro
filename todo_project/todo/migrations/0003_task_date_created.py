# Generated by Django 5.0.6 on 2024-05-26 15:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("todo", "0002_task_important"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="date_created",
            field=models.DateField(default=datetime.date.today),
        ),
    ]
