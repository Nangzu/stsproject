import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/calendar.css";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";


const CalendarPage = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [transactions, setTransactions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [detailsByDate, setDetailsByDate] = useState({});
    const [expandedDetail, setExpandedDetail] = useState(null); // 상세정보 표시 상태

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    // 현재 월 데이터를 가져오는 함수
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/transactions`);
                const transactionsData = response.data || [];
                setTransactions(transactionsData); // calendar 데이터를 저장
                const details = transactionsData.reduce((acc, transaction) => {
                    if (!acc[transaction.date]) acc[transaction.date] = [];
                    acc[transaction.date].push(transaction);
                    return acc;
                }, {});
                setDetailsByDate(details); // 각 날짜별 거래 내역 저장
            } catch (error) {
                console.error("거래 내역을 가져오는 중 오류 발생:", error);
            }
        };
        fetchTransactions();
    }, [year, month]);

    //날짜 이동시 수정창 닫기
    useEffect(() => {
        setExpandedDetail(null);
    }, [selectedDate]);

    const goToPreviousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const goToNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };
    const addDetail = () => {
        if (!selectedDate) {
            alert("날짜를 먼저 선택해주세요.");
            return;
        }
        // 선택된 날짜에 이미 10개 이상의 상세정보가 있으면 더 이상 추가 X
        if ((detailsByDate[selectedDate] || []).length >= 10) {
            alert("한 날짜에 10개 이상의 상세정보를 추가할 수 없습니다.");
            return;
        }
        setDetailsByDate((prevDetails) => ({
            ...prevDetails,
            [selectedDate]: [
                ...(prevDetails[selectedDate] || []),
                { type: "수입", amount: "", category: "", memo: "" },
            ],
        }));
    };

    const toggleDetailExpand = (index) => {
        setExpandedDetail(expandedDetail === index ? null : index); // 상세정보 확장/축소
    };

    const updateDetail = (index, key, value) => {
        setDetailsByDate((prevDetails) => ({
            ...prevDetails,
            [selectedDate]: prevDetails[selectedDate].map((detail, i) =>
                i === index ? { ...detail, [key]: value } : detail
            ),
        }));
    };

    const saveDetail = async (index) => {
        if (!selectedDate) return;
        const detail = detailsByDate[selectedDate][index]
        if(!detail) return;

        if (!detail.type || !detail.amount || !detail.category) {
            alert("모든 필수 정보를 입력해주세요.");
            return;
        }
        const name = `${detail.type}: ${formatAmount(detail.amount)}원`;

        const updatedDetail = {
            ...detail,
            saved: true,
            name: name,
            amount: detail.type === "지출" ? -Math.abs(detail.amount) : Math.abs(detail.amount), // 지출이면 음수 처리
            date: selectedDate, // 저장 시 날짜를 추가
        };

        setDetailsByDate((prevDetails) => ({
            ...prevDetails,
            [selectedDate]: prevDetails[selectedDate].map((d, i) =>
                i === index ? updatedDetail : d
            ),
        }));

        try {
            // 저장된 데이터인지 확인하여 PUT 요청 또는 POST 요청 수행
            if (detail.saved) {
                // 수정 (PUT 요청)
                await axios.put(`http://localhost:5000/transactions/${detail.id}`, updatedDetail);
            } else {
                // 새로 저장 (POST 요청)
                const response = await axios.post("http://localhost:5000/transactions", updatedDetail);
                updatedDetail.id = response.data.id; // 새로 생성된 ID를 추가
            }

            alert("저장되었습니다.");

            // 상태 업데이트
            setDetailsByDate((prevDetails) => ({
                ...prevDetails,
                [selectedDate]: prevDetails[selectedDate].map((d, i) =>
                    i === index ? { ...updatedDetail, saved: true } : d
                ),
            }));

            // 전체 거래 내역 업데이트
            setTransactions((prevTransactions) => {
                const filteredTransactions = prevTransactions.filter((t) => t.id !== updatedDetail.id);
                return [...filteredTransactions, updatedDetail];
            });
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("저장에 실패했습니다.");
        }

        setExpandedDetail(null); // 저장 후 토글 닫기
    };

    const removeDetail = async (index) => {
        if (!selectedDate) return;
        const detail = detailsByDate[selectedDate][index];
        if (!detail || !detail.id) return; // ID가 없는 경우 방어 코드

        try {
            // DELETE 요청으로 해당 상세정보 삭제
            await axios.delete(`http://localhost:5000/transactions/${detail.id}`);
            alert("삭제되었습니다.");

            // 프론트엔드 상태 업데이트
            setDetailsByDate((prevDetails) => ({
                ...prevDetails,
                [selectedDate]: prevDetails[selectedDate].filter((_, i) => i !== index),
            }));
            // 삭제 후 거래 내역 업데이트
            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction.id !== detail.id)
            );
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    const generateCalendarDays = () => {
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ date: null });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            const dailyTransactions = transactions.filter((t) => t.date === date);

            // 수입과 지출을 계산
            const totalIncome = dailyTransactions
                .filter((t) => t.amount > 0)
                .reduce((acc, t) => acc + t.amount, 0);
            const totalExpense = dailyTransactions
                .filter((t) => t.amount < 0)
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);

            days.push({ date, totalIncome, totalExpense });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const today = new Date().toISOString().split("T")[0];

    const formatAmount = (amount) => {
        const absAmount = Math.abs(amount); // 절대값 계산
        let formattedAmount = "";

        if (absAmount >= 100000000) {
            const billions = Math.floor(absAmount / 100000000);
            const remaining = Math.floor((absAmount % 100000000) / 10000); // 남은 금액 중 만 단위
            formattedAmount = remaining > 0 ? `${billions}억 ${remaining}만` : `${billions}억`;
        } else if (absAmount >= 10000) {
            formattedAmount = `${Math.floor(absAmount / 10000)}만`;
        } else {
            formattedAmount = absAmount.toString();
        }

        // 금액이 음수인 경우 "-" 붙여 반환
        return amount < 0 ? `-${formattedAmount}` : formattedAmount;
    };

    return (
        <div className="calendar-container">
            {/* 달력 부분 */}
            <div>
                <header className="calendar-header">
                    <h2>
                        {year}년 {month}월
                    </h2>
                    <div className="calendar-arrow">
                        <button className="arrow-btn" onClick={goToPreviousMonth}>
                            <IoIosArrowBack size={28}/>
                        </button>
                        <button className="arrow-btn" onClick={goToNextMonth}>
                            <IoIosArrowForward size={28}/>
                        </button>
                    </div>
                </header>
                <div className="calendar">
                    <div className="calendar-grid weekdays">
                    {weekdays.map((day, index) => (
                            <div key={index} className="weekday">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {calendarDays.map((day, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${day.date === today ? "current-day" : ""} ${
                                    day.date === selectedDate ? "selected-day" : ""
                                }`}
                                onClick={() => setSelectedDate(day.date)}
                            >
                                {day.date && <p>{new Date(day.date).getDate()}</p>}
                                <div className="transaction">
                                    {/* 수입과 지출 표시 */}
                                    {day.totalIncome > 0 && (
                                        <div className="income">
                                            <p>+{formatAmount(day.totalIncome)}원</p>
                                        </div>
                                    )}
                                    {day.totalExpense > 0 && (
                                        <div className="expense">
                                            <p>-{formatAmount(day.totalExpense)}원</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/*상세정보 부분*/}
            {selectedDate && (
                <div className="detail-container">
                    <h3>{selectedDate &&
                        `${Number(selectedDate.split("-")[1])}월 
                        ${Number(selectedDate.split("-")[2])}일`}</h3>

                    <button onClick={addDetail}
                            className={`add-detail-button ${expandedDetail !== null ? "hidden" : ""}`}
                            >
                        추가하기
                    </button>
                    {detailsByDate[selectedDate]?.length > 0 ? (
                        detailsByDate[selectedDate]?.map((detail, index) => (
                            <div key={index} className={`detail-item ${expandedDetail === index ? 'expanded' : ''}`}>
                                <div onClick={() => toggleDetailExpand(index)} className="detail-header">
                                    {detail.saved ? detail.name : `상세정보 ${index + 1}`}
                                </div>
                                {expandedDetail === index && (
                                    <div className="detail-content">
                                        {/* 수입/지출 버튼 */}
                                        <div className="detail-type-buttons">
                                            <button
                                                className={`type-button ${detail.type === "수입" ? "active" : ""}`}
                                                onClick={() => updateDetail(index, "type", "수입")}
                                            >
                                                수입
                                            </button>
                                            <button
                                                className={`type-button ${detail.type === "지출" ? "active" : ""}`}
                                                onClick={() => updateDetail(index, "type", "지출")}
                                            >
                                                지출
                                            </button>
                                        </div>
                                        {/* 금액 입력 */}
                                        <input
                                            type="number"
                                            placeholder="금액"
                                            className="detail-input"
                                            value={detail.amount}
                                            onChange={(e) => updateDetail(index, "amount", e.target.value)}
                                        />
                                        {/* 카테고리 선택 */}
                                        <div className="detail-category-buttons">
                                            {["쇼핑", "교통", "저금"].map((category) => (
                                                <button
                                                    key={category}
                                                    className={`category-button ${
                                                        detail.category === category ? "active" : ""
                                                    }`}
                                                    onClick={() => updateDetail(index, "category", category)}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                        {/* 메모 입력 */}
                                        <input
                                            type="text"
                                            className="detail-input memo-input"
                                            placeholder="메모"
                                            value={detail.memo}
                                            onChange={(e) => updateDetail(index, "memo", e.target.value)}
                                        />
                                        {/* 저장 및 삭제 버튼 */}
                                        <div className="detail-buttons">
                                            <button onClick={() => saveDetail(index)} className="save-button">
                                                저장
                                            </button>
                                            <button onClick={() => removeDetail(index)} className="remove-button">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>선택된 날짜에 상세정보가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
