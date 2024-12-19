import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/summary.css";
import { useNavigate } from "react-router-dom";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import useUserStore from "../store/userStore";
import useFinanceStore from "../store/financeStore";

const SummaryPage = () => {
  const navigate = useNavigate();
  const { userInfo, fetchUserInfo } = useUserStore();
  const { transactions, fetchTransactions } = useFinanceStore();
  const [isLoading, setIsLoading] = useState(true);

  const calculateTotalSpent = () => {
    return transactions
        .filter((transaction) => transaction.division === "지출")
        .reduce((total, transaction) => total + transaction.amount, 0); // 금액 합산
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserInfo(navigate); // 유저 정보 가져오기
        await fetchTransactions(); // 거래 내역 가져오기
        setIsLoading(false); // 로딩 완료
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        setIsLoading(false); // 로딩 완료
      }
    };
    fetchData();
  }, [fetchUserInfo, fetchTransactions]);

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (!userInfo) {
    return <div>유저 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="summary-page">
      <div className="top-container">
        <div className="credit-score"  onClick={() => navigate("/main/profile/mypage")} >
          <h3>나의 신용 점수</h3>
          <div className="score">
            {userInfo.score !== null ? (
                <>
                  {userInfo.score}
                  <span className="unit">점</span>
                </>
            ) : (
                "측정 필요" // 점수가 없는 경우 "측정 필요" 표시
            )}
          </div>
        </div>

        <div className="top-category" onClick={() => navigate("/main/chart/patterns")}>
          <h3>나는 요즘</h3>
          <div className="category">미구현
            <p className="etc">에 많이 써요</p>
          </div>
        </div>
        <div className="summary-menu">
          <h3>추가 기능</h3>
        </div>
        <div className="empty-container">
          <div className="add-button">
            <span className="plus-icon">+</span>
          </div>
        </div>
      </div>

      <div className="bottom-container">
        <div className="recent-transactions"
             onClick={() => navigate("/main/calendar/expenses")}>
          <h3>최근 내역</h3>
          <ul>
            {transactions.slice(0, 5).map((transaction, index)  => (
              <li key={index}>
                <span><RiMoneyDollarCircleFill size={28}/></span>
                <span>{transaction.amount.toLocaleString()} 원</span>
                <span>{transaction.division}</span>
                <span>{transaction.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="total-spent">
          <h3>이번달 쓴 돈</h3>
          <p>{calculateTotalSpent().toLocaleString()} 원</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;