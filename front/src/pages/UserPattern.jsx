import React, { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import useFinanceStore from "../store/financeStore";

// Chart.js에 필요한 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const UserPatternPage = () => {
    const { transactions, fetchTransactions } = useFinanceStore();

    useEffect(() => {
        if (transactions.length === 0) {
            fetchTransactions(); // 거래 내역을 불러옴
        }
    }, [transactions, fetchTransactions]);

    // 현재 날짜와 이번 달 계산
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const currentMonthString = `${currentYear}-${currentMonth}`;

    // 이번 달 데이터 필터링
    const currentMonthTransactions = transactions.filter((transaction) =>
        transaction.date.startsWith(currentMonthString)
    );

    // 월별 지출 계산
    const monthlySpending = transactions.reduce((acc, transaction) => {
        if (transaction.type === "지출") {
            const transactionDate = new Date(transaction.date);
            const month = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;
            acc[month] = (acc[month] || 0) + transaction.amount;
        }
        return acc;
    }, {});

    const monthlySpendingLabels = Object.keys(monthlySpending);
    const monthlySpendingData = Object.values(monthlySpending);

    // 이번 달 카테고리별 지출 계산
    const categorySpending = currentMonthTransactions.reduce((acc, transaction) => {
        if (transaction.type === "지출") {
            acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        }
        return acc;
    }, {});

    const categoryLabels = Object.keys(categorySpending);
    const categoryData = Object.values(categorySpending);

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* 막대그래프 */}
            <div style={{ width: "50%" }}>
                <h2>월별 지출 내역</h2>
                <Bar
                    data={{
                        labels: monthlySpendingLabels,
                        datasets: [
                            {
                                label: "지출 금액 (원)",
                                data: monthlySpendingData,
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            tooltip: { enabled: true },
                        },
                    }}
                />
                <p>
                    평균 지출:{" "}
                    {(monthlySpendingData.reduce((acc, cur) => acc + cur, 0) / monthlySpendingLabels.length).toFixed(2)}
                    원
                </p>
            </div>

            {/* 원형그래프 */}
            <div style={{ width: "50%" }}>
                <h2>이번 달 카테고리별 지출</h2>
                <Pie
                    data={{
                        labels: categoryLabels,
                        datasets: [
                            {
                                label: "카테고리별 지출",
                                data: categoryData,
                                backgroundColor: [
                                    "#FF6384",
                                    "#36A2EB",
                                    "#FFCE56",
                                    "#4BC0C0",
                                    "#9966FF",
                                    "#FF9F40",
                                ],
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            tooltip: { enabled: true },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default UserPatternPage;
