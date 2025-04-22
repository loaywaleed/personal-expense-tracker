from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,
)
from rest_framework.permissions import IsAuthenticated
from .serializers import ExpenseSerializer, CategorySerializer
from .models import Expense, Category
from .filters import ExpenseFilter


class ExpenseListCreateView(ListCreateAPIView):
    """
    view to retrieve and create expenses for the current logged in user.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    filterset_class = ExpenseFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
    view to get, update, or delete an expense for the current user.
    """

    permission_classes = [IsAuthenticated]

    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class CategoryListView(ListAPIView):
    """
    global view to get categories (will probably hardcode it)
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
