import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/calendar.css";

const CalendarPage = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [transactions, setTransactions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
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

    const handleDateClick = (date) => {
        setSelectedDate(date);
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
            days.push({ date, transactions: dailyTransactions });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="calendar-container">
            {/* 달력 부분 */}
            <div>
                <header className="calendar-header">
                    <button className="arrow-btn left-arrow" onClick={goToPreviousMonth}></button>
                    <h2>
                        {year}년 {month}월
                    </h2>
                    <button className="arrow-btn right-arrow" onClick={goToNextMonth}></button>
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
                                onClick={() => handleDateClick(day.date)}
                            >
                                {day.date && <p>{new Date(day.date).getDate()}</p>}
                                {day.transactions &&
                                    day.transactions.map((t, i) => (
                                        <div
                                            key={i}
                                            className={`transaction ${
                                                t.amount > 0 ? "amount-positive" : "amount-negative"
                                            }`}
                                        >
                                            <p>{t.amount}</p>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 디테일 정보 표시 부분 */}
            <div className="detail-container">
                {selectedDate ? (
                    <div>
                        <h3>{selectedDate}의 상세 정보</h3>
                        {transactions
                            .filter((t) => t.date === selectedDate)
                            .map((t, index) => (
                                <div key={index} className="detail-item">
                                    <p>카테고리: {t.category}</p>
                                    <p>금액: {t.amount > 0 ? `+${t.amount}` : t.amount}</p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div>
                        <h3>날짜를 선택해주세요</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
