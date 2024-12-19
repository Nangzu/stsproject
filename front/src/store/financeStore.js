import {create} from 'zustand';
import axios from 'axios';
import useUserStore from "./userStore";


const useFinanceStore = create((set) => ({
    transactions: [], // Default value
    incomeTotal: 0,
    expenseTotal: 0,

    fetchTransactions: async () => {
        const { userInfo, fetchUserInfo } = useUserStore.getState();

        // 유저 정보가 없으면 fetchUserInfo 호출
        if (!userInfo) {
            console.log("유저 정보를 가져오는 중...");
            await fetchUserInfo(); // 유저 정보를 비동기로 가져옴
        }
        const updatedUserInfo = useUserStore.getState().userInfo; // 최신 상태의 userInfo 가져오기
        if (!updatedUserInfo || !updatedUserInfo.id) {
            console.error("유저 정보가 없습니다. 거래 내역을 불러올 수 없습니다.");
            return;
        }

        try {
            const response = await
                axios.get(`http://localhost:8080/api/history/user/${updatedUserInfo.id}`);
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
