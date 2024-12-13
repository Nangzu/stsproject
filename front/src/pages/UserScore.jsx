import "../css/mypage.css";
import React, { useState } from "react";
import ScoreGraph from "../component/scoreGraph";

const UserScorePage = () => {
    const [score,setScore] =useState(0);

    const handleMeasureScore = () => {
        // 신용점수 측정 로직 넣어야됨. 아니면 점수받아오는거 넣던지.

        setScore(870);
    };
    return (
        <div className="score-container">
            <div className="score">
                <div className="content-name">신용점수</div>
                <div>
                    <ScoreGraph
                        data={[score, 1000 - score]}
                        labels={["Score", "Remaining"]}
                        colors={["#FF9999", "#DDDDDD"]}
                        title="1등급"
                        centerText={`${score}점`}
                    />
                </div>
                <form>
                    <button
                        type="button"
                        onClick={handleMeasureScore}
                        className="score-button"
                    >
                        신용점수 측정하기
                    </button>
                </form>
            </div>
        </div>

    );
};

export default UserScorePage;
