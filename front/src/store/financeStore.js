import {create} from 'zustand';
import axios from 'axios';

const useFinanceStore = create((set) => ({
    transactions: [], // Default value
    incomeTotal: 0,
    expenseTotal: 0,
    fetchTransactions: async () => {
        try {
            const response = await
                axios.get("http://localhost:5000/transactions");
            set({ transactions: response.data });
        } catch (error) {
            console.error("거래정보 불러오기 실패", error);
        }
    },
    addTransaction: (transaction) =>
        set((state) => ({
            transactions: [...state.transactions, transaction],
        })),
    updateTransaction: (updatedTransaction) =>
        set((state) => ({
            transactions: state.transactions.map((t) =>
                t.id === updatedTransaction.id ? updatedTransaction : t
            ),
        })),
    removeTransaction: (id) =>
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
        })),
}));

export default useFinanceStore;
