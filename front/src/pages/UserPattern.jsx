import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import useFinanceStore from "../store/financeStore";
import ScoreGraph from "../component/scoreGraph"; // ScoreGraph 컴포넌트를 import
import "../css/userpattern.css"; // CSS import
import { useNavigate } from "react-router-dom";

// Chart.js에 필요한 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels );

const UserPatternPage = () => {
    const navigate = useNavigate();
    const { transactions, fetchTransactions } = useFinanceStore();

    useEffect(() => {
        if (transactions.length === 0) {
            fetchTransactions(navigate); // 거래 내역을 불러옴
        }
    }, [transactions, fetchTransactions]);

    // 현재 날짜와 지난 6개월 계산
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const currentMonthString = `${currentYear}-${currentMonth}`;

    // 최근 6개월 데이터 계산
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(month.getMonth() - i);
        const monthString = `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, "0")}`;
        months.push(monthString);
    }

    // 최근 6개월 데이터 필터링
    const monthlySpending = transactions.reduce((acc, transaction) => {
        if (transaction.type === "지출") {
            const transactionDate = new Date(transaction.udate);
            const month = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, "0")}`;
            if (months.includes(month)) {
                acc[month] = (acc[month] || 0) + transaction.amount;
            }
        }
        return acc;
    }, {});

    // 6개월 동안의 지출이 없는 달도 0원으로 추가
    months.forEach((month) => {
        if (!(month in monthlySpending)) {
            monthlySpending[month] = 0;
        }
    });

    const monthlySpendingLabels = months;
    const monthlySpendingData = months.map((month) => monthlySpending[month]);

    // 이번 달 카테고리별 지출 계산
    const currentMonthTransactions = transactions.filter((transaction) =>
        transaction.udate.startsWith(currentMonthString)
    );

    const categorySpending = currentMonthTransactions.reduce((acc, transaction) => {
        if (transaction.type === "지출") {
            acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        }
        return acc;
    }, {});

    const categoryLabels = Object.keys(categorySpending);
    const categoryData = Object.values(categorySpending);

    // 카테고리별 총 지출
    const totalCategorySpending = categoryData.reduce((acc, cur) => acc + cur, 0);

    // 범례 색상 배열
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

    // 금액을 억, 만 단위로 변환하는 함수
    const formatAmount = (amount) => {
        if (amount >= 100000000) {
            return `${(amount / 100000000).toFixed(1)}억`;
        } else if (amount >= 10000) {
            return `${(amount / 10000).toFixed(1)}만`;
        } else {
            return `${amount.toLocaleString()}원`;
        }
    };

    return (
        <div className="user-pattern-container">
            <div className="graph-section">
                <h2>최근 6개월 지출 내역</h2>
                <Bar
                    data={{
                        labels: monthlySpendingLabels,
                        datasets: [
                            {
                                label: "지출 금액 (원)",
                                data: monthlySpendingData,
                                backgroundColor: "#007bff",
                                borderColor: "#007bff",
                                borderWidth: 1,
                                borderRadius: 10,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        indexAxis: 'x', // 막대 방향을 수평으로 변경
                        plugins: {
                            legend: {display: false},
                            tooltip: {enabled: true},
                            datalabels: {
                                display: true,
                                formatter: (value) => formatAmount(value),
                                color: "black",
                                font: {weight: "bold"},
                                align: "end",
                                anchor: "end",
                            },
                        },
                        scales: {
                            x: {
                                grid: {display: false},
                                beginAtZero: true
                            }, // 0부터 시작
                            y: {
                                display: false,
                                reverse: false
                            }, // 아래에서 위로 올라가도록 설정
                        },
                        layout: {
                            padding: {
                                top: 20, // 위쪽 여백 추가
                            },
                        },
                    }}
                    className="bar-chart"
                />
                <div className="average-spending">
                    최근 6개월 평균 지출:{" "}
                    {Math.floor(monthlySpendingData.reduce((acc, cur) => acc + cur, 0) / monthlySpendingLabels.length)} 원
                </div>
            </div>

            <div className="legend-section">
                <h2>이번 달 쓴 돈</h2>
                <ScoreGraph
                    data={categoryData}
                    labels={categoryLabels}
                    colors={colors}
                    centerText={`${totalCategorySpending.toLocaleString()}원`}
                    className="score-graph-center-text"
                />
                <ul className="legend-list">
                    {categoryLabels.map((label, index) => (
                        <li key={label} className="legend-list-item">
                            <div
                                className="legend-color-box"
                                style={{
                                    backgroundColor: colors[index % colors.length],
                                }}
                            ></div>
                            {label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserPatternPage;
