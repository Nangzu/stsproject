import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/calendar.css";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import useFinanceStore from "../store/financeStore";


const CalendarPage = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [detailsByDate, setDetailsByDate] = useState({});
    const [expandedDetail, setExpandedDetail] = useState(null); // 상세정보 표시 상태
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const { //zustand 스토어 써보기
        transactions =[],
        setTransactions,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        removeTransaction
    } = useFinanceStore();


    //날짜 이동시 수정창 닫  기
    useEffect( () => {
        fetchTransactions();
    }, [fetchTransactions]);

    //가져온 거래내역 날짜로 그룹화
    useEffect(() => {
        const fetchAndGroupTransactions = async () => {
            try {
                await fetchTransactions();
                groupTransactions();
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        };
        fetchAndGroupTransactions();
    }, [fetchTransactions]);

    const groupTransactions = () => {
        const groupedDetails = transactions.reduce((acc, transaction) => {
            const date = transaction.udate;
            if (!acc[date]) acc[date] = [];
            acc[date].push(transaction);
            return acc;
        }, {});

        setDetailsByDate(groupedDetails);
    };

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

        const newDetail = {
            type: "수입",
            amount: "",
            category: "",
            description: "",
            udate: selectedDate };



        setDetailsByDate((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            if (!updatedDetails[selectedDate]) updatedDetails[selectedDate] = [];
            updatedDetails[selectedDate].push(newDetail);

            return updatedDetails;
        });
        setSelectedDate(selectedDate);
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

        const updatedDetail = {
            ...detail,
            amount: detail.type === "지출" ? Math.abs(detail.amount) : Math.abs(detail.amount)
        };


        try {
            console.log(detail.id)
            if (detail.id) {
                await axios.put(`http://localhost:8080/api/transactions/${detail.id}`, updatedDetail, {
                    withCredentials: true,
                });
                updateTransaction(updatedDetail);
                await fetchTransactions();

            } else {
                const response = await axios.post("http://localhost:8080/api/transactions", updatedDetail, {
                    withCredentials: true, // 세션/쿠키를 함께 전송
                });
                console.log(response.data);  // 응답 데이터를 로그로 출력해 확인
                console.log(updatedDetail.id);
                console.log(response.data.id);
                updatedDetail.id = response.data.id;
                addTransaction(updatedDetail);
                await fetchTransactions();

            }

            setDetailsByDate((prevDetails) => {
                const updatedDetails = { ...prevDetails };
                if (!updatedDetails[selectedDate]) updatedDetails[selectedDate] = [];
                updatedDetails[selectedDate] = updatedDetails[selectedDate].map((d, i) =>
                    i === index ? updatedDetail : d
                );
                return updatedDetails;
            });

            alert("저장되었습니다.");
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("저장에 실패했습니다.");
        }

        setExpandedDetail(null); //저장후 토글닫기
    };

    const removeDetail = async (index) => {
        if (!selectedDate) return;
        const detail = detailsByDate[selectedDate][index];
        console.log(detail.id)
        if (!detail || !detail.id) return; // ID가 없는 경우 방어 코드

        try {
            // DELETE 요청으로 해당 상세정보 삭제
            await axios.delete(`http://localhost:8080/api/transactions/${detail.id}`, {
                withCredentials: true, // 세션/쿠키를 함께 전송
            });

            removeTransaction(detail.id);
            alert("삭제되었습니다.");

            // 프론트엔드 상태 업데이트
            setDetailsByDate((prevDetails) => {
                const updatedDetails = { ...prevDetails };
                updatedDetails[selectedDate] = updatedDetails[selectedDate].filter((_, i) => i !== index);
                return updatedDetails;
            });

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
            const dailyTransactions = transactions.filter((t) => t.udate === date);
            //const dailyTransactions = detailsByDate[date] || [];

            // 수입과 지출을 계산 (t.type 기준)
            const totalIncome = dailyTransactions
                .filter((t) => t.type === "수입") // 수입만 필터링
                .reduce((acc, t) => acc + t.amount, 0);

            const totalExpense = dailyTransactions
                .filter((t) => t.type === "지출") // 지출만 필터링
                .reduce((acc, t) => acc + Math.abs(t.amount), 0); // 지출은 절대값으로 처리

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
                                    {detail.type && detail.amount
                                        ?  `${detail.type === "수입" ? "수입" : "지출"} ${formatAmount(detail.amount)}원`
                                        : `상세정보 ${index + 1}`}
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
                                            value={detail.amount || ''}
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
                                            value={detail.description || ''}
                                            onChange={(e) => updateDetail(index, "description", e.target.value)}
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
