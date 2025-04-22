from rest_framework import serializers
from .models import Expense, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
        read_only_fields = ["id"]


class ExpenseSerializer(serializers.ModelSerializer):

    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Expense

        fields = [
            "id",
            "category",
            "category_name",
            "description",
            "amount",
            "date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
