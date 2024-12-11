import "../css/mypage.css";
import React, { useState } from "react";
import ScoreGraph from "../component/scoreGraph";

const UserScorePage = () => {
    const [score,setScore] =useState(0);

    const handleMeasureScore = () => {
        // 신용점수 측정 로직 아마 Ajax?

        setScore(870);
    };
    return (
        <div className="score-container">
            <div className="score">
                <div className="content-name">신용점수</div>
                <div>
                    <ScoreGraph score={score}/>
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
