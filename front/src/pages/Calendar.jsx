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
                const response = await axios.get(`http://localhost:5000/calendar`);
                setTransactions(response.data.transactions); // calendar 데이터를 저장
            } catch (error) {
                console.error("거래 내역을 가져오는 중 오류 발생:", error);
            }
        };
        fetchTransactions();
    }, [year, month]);

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

    const saveDetail = (index) => {
        setDetailsByDate((prevDetails) => ({
            ...prevDetails,
            [selectedDate]: prevDetails[selectedDate].map((detail, i) =>
                i === index
                    ? {
                        ...detail,
                        saved: true,
                        name: `${detail.type} : ${formatAmount(detail.amount)}원`, // 자동 이름 설정
                    }
                    : detail
            ),
        }));
        setExpandedDetail(null); // 저장 후 토글 닫기
    };

    const removeDetail = (index) => {
        if (!selectedDate) return;

        setDetailsByDate((prevDetails) => ({
                ...prevDetails,
                [selectedDate]: prevDetails[selectedDate].filter((_, i) => i !== index),
        }));
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
            const savedDetails = detailsByDate[date]?.map((detail) => detail.name).filter(Boolean) || [];
            days.push({ date, transactions: dailyTransactions, savedDetails });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const today = new Date().toISOString().split("T")[0];

    const formatAmount = (amount) =>{
        if (amount >= 100000000){
            const billions = Math.floor(amount / 100000000);
            const remaining = Math.floor((amount % 100000000) / 10000); // 남은 금액 중 만 단위
            return remaining > 0 ? `${billions}억 ${remaining}만` : `${billions}억`;
        }
        else if (amount >= 10000)
        {
            return `${Math.floor(amount/10000)}만`;
        }
        return amount;
    }

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

                                {day.savedDetails?.map((name, i) => (
                                    <div key={i} className="saved-detail-name">
                                        {name}
                                    </div>
                                ))}

                                {day.transactions &&
                                    day.transactions.map((t, i) => (
                                        <div
                                            key={i}
                                            className={`transaction ${
                                                t.amount > 0 ? "amount-positive" : "amount-negative"
                                            }`}
                                        >
                                            <p>{formatAmount(t.amount)}원</p>
                                        </div>
                                    ))}
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
