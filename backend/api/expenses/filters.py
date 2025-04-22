from django_filters import rest_framework as filters
from .models import Expense


class ExpenseFilter(filters.FilterSet):
    """
    filtering class for expenses.
    """

    date = filters.DateFilter(
        field_name="date",
        lookup_expr="exact",
        input_formats=[
            "%Y-%m-%d",
            "%d-%m-%Y",
        ],
    )
    date_from = filters.DateFilter(
        field_name="date",
        lookup_expr="gte",
        input_formats=["%Y-%m-%d", "%d-%m-%Y"],
    )
    date_to = filters.DateFilter(
        field_name="date",
        lookup_expr="lte",
        input_formats=["%Y-%m-%d", "%d-%m-%Y"],
    )
    category = filters.CharFilter(field_name="category__name", lookup_expr="iexact")

    class Meta:
        model = Expense
        fields = ["date", "date_from", "date_to", "category"]
