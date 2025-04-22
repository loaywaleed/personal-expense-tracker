from django.db import models
from django.conf import settings


class Expense(models.Model):
    """
    Model representing an expense.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expenses",
    )
    category = models.ForeignKey(
        "Category",
        on_delete=models.CASCADE,
        related_name="expenses",
    )
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.date}"


class Category(models.Model):
    """
    Model representing a category for expenses.
    """

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
