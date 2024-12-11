import React, { useRef, useEffect } from "react";
import {Chart, ArcElement, Tooltip, Legend, DoughnutController} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const ScoreGraph = ({score}) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);  // 차트 인스턴스를 저장할 변수

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); // 기존 차트 삭제
        }
        const ctx = chartRef.current.getContext("2d");

        chartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Score", "Remaining"],
                datasets: [
                    {
                        data: [score, 1000 - score], // 점수와 나머지 값
                        backgroundColor: ["#FF9999", "#DDDDDD"], // 그래프 색상
                        borderWidth: 0, // 테두리 없애기
                    },
                ],
            },
            options: {
                rotation: -105, // 그래프 시작 각도 
                circumference: 210, // 그려지는 정도
                cutout: "70%", // 가운데 비우기
                plugins: {
                    legend: {
                        display: false, // 범례 숨기기
                    },
                    tooltip: {
                        enabled: false, // 툴팁 숨기기
                    },
                },
            },
        });
        // 컴포넌트 언마운트 시 차트 인스턴스 정리
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [score]);  // score가 변경될 때마다 차트도 변경
    return (
        <div style={{position: "relative", width: "300px", height: "300px"}}>
            <canvas ref={chartRef}></canvas>
            {/* 점수와 등급 표시 */}
            <div
                style={{
                    position: "absolute",
                    top: "70%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                }}
            >
                <div style={{fontSize: "26px", fontWeight: "bold", margin:5}}>1등급</div>
                <div style={{fontSize: "26px", fontWeight: "bold"}}>{score}점</div>
            </div>
        </div>
    );
};

export default ScoreGraph;
