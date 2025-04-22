from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseRetrieveUpdateDestroyView,
    CategoryListCreateView,
)


urlpatterns = [
    path("expenses", ExpenseListCreateView.as_view(), name="expense-list-create"),
    path(
        "expenses/<int:pk>",
        ExpenseRetrieveUpdateDestroyView.as_view(),
        name="expense-retrieve-update-destroy",
    ),
    path("categories", CategoryListCreateView.as_view(), name="category-list-create"),
]
