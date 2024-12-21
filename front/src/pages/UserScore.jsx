import "../css/mypage.css";
import React, {useEffect, useState} from "react";
import ScoreGraph from "../component/scoreGraph";
import axios from "axios";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom"

const UserScorePage = () => {
    const navigate = useNavigate();
    const [score,setScore] =useState(0);
    const { userInfo, fetchUserInfo } = useUserStore();
    
    // 페이지가 처음 로드될 때 로그인된 유저 정보를 가져오기
    useEffect(() => {
        if (!userInfo) {  // userInfo가 없다면 유저 정보를 가져오기
            fetchUserInfo(navigate);
        }
        setScore(userInfo.score)
    }, [userInfo, fetchUserInfo]);

    const  handleMeasureScore = async () => {
        if (!userInfo) {
            console.error("유저정보가없습니다");
            return;
        }
        try {
            // 로그인된 유저 ID로 신용점수 측정 API 호출
            const response = await axios.get(`http://localhost:8080/api/userscore/${userInfo.id}`);
            setScore(response.data);  // 응답에서 받은 점수를 상태에 저장
        } catch (error) {
            console.error("Error fetching score:", error);
        }
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
                        centerText={`${score || 0}점`} //이거 null이면 0점띄우기
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
