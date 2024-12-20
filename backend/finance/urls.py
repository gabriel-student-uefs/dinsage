from django.urls import path
from .views import (
    FinancialGoalListCreateAPIView, 
    FinancialGoalDetailAPIView, 
    TransactionListCreateAPIView, 
    TransactionDetailAPIView, 
    UserTotalAmountAPIView,
    UserRankingAPIView,
    IndividualRankingAPIView
)

urlpatterns = [
    path('financial-goals/', FinancialGoalListCreateAPIView.as_view(), name='financial-goal-list-create'),
    path('financial-goals/<int:pk>/', FinancialGoalDetailAPIView.as_view(), name='financial-goal-detail'),
    path('transactions/', TransactionListCreateAPIView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailAPIView.as_view(), name='transaction-detail'),
    path('total-amount/', UserTotalAmountAPIView.as_view(), name='user-total-amount'),
    path('users-ranking/', UserRankingAPIView.as_view(), name='users-ranking'),
    path('individual-ranking/', IndividualRankingAPIView.as_view(), name='individual-ranking'),
]