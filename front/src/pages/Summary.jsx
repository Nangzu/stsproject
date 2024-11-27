import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/summary.css";
const SummaryPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    //백엔드 api호출하기
    const fetchSummaryData = async () => {
      try {
        //const response = await axios.get("/api/summary"); 
        const response =
          await axios
            .get("http://localhost:5000/summary");
        /*머신용점수,최근거래내역이런거정보*/
        setSummaryData(response.data); // 데이터 담기
        setIsLoading(false); //로딩 완료
      }
      catch (error) {
        console.error("요약데이터 가져오는데 에러발생".error);
        setIsLoading(false);
      }
    };
    fetchSummaryData();
  }, []);

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (!summaryData) {
    return <div>로딩데이터 오류</div>;
  }

  return (
    <div className="summary-page">
      <div className="top-container">
        <div className="credit-score">
          <h3>나의 신용 점수</h3>
          <div className="score">{summaryData.creditScore}
            <span className="unit">점</span>
          </div>
        </div>

        <div className="top-category">
          <h3>나는 요즘</h3>
          <div className="category">{summaryData.topCategory}
            <p className="etc">에 많이 써요</p>
          </div>
        </div>
        <div className="summary-menu">
          <h3>여기에</h3>
          <h3>추가 기능</h3>
        </div>
        <div className="empty-container">
          <div className="add-button">
            <span className="plus-icon">+</span>
          </div>
        </div>
      </div>

      <div className="bottom-container">
        <div className="recent-transactions">
          <h3>최근 내역</h3>
          <ul>
            {summaryData.recentTransactions.map((transaction, index) => (
              <li key={index}>
                <span>💲</span>
                <span>{transaction.amount.toLocaleString()} 원</span>
                <span>{transaction.category}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="total-spent">
          <h3>이번달 쓴 돈</h3>
          <p>{summaryData.totalSpentThisMonth.toLocaleString()} 원</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;