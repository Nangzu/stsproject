import React, { useRef, useEffect } from "react";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const ScoreGraph = ({ data, labels, colors, title, centerText }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); // 기존 차트 삭제
        }
        const ctx = chartRef.current.getContext("2d");

        chartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: colors,
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

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, labels, colors]); // 데이터가 변경될 때마다 차트 업데이트

    return (
        <div style={{ position: "relative", width: "300px", height: "300px" }}>
            <canvas ref={chartRef}></canvas>
            {/* 중앙 텍스트 표시 */}
            <div
                style={{
                    position: "absolute",
                    top: "70%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                }}
            >
                {title && (
                    <div style={{ fontSize: "26px", fontWeight: "bold", margin: 5 }}>
                        {title}
                    </div>
                )}
                {centerText && (
                    <div style={{ fontSize: "26px", fontWeight: "bold" }}>
                        {centerText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoreGraph;
