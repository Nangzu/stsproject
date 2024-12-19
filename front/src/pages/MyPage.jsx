import "../css/mypage.css";
import { FaUserCircle } from "react-icons/fa";
import {Outlet, Link, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import useUserStore from "../store/userStore";

const MyPagePage = () => {
    const { userInfo, fetchUserInfo,logout  } = useUserStore(); //zustand쓰는거
    const navigate = useNavigate();
    useEffect(() => {
        if (!userInfo) {  // 유저 정보가 없다면 API 요청
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo]);
    const handleLogout = async () => {
        await logout(); // 로그아웃 요청 보내기
        navigate("/");  // 로그인 페이지로 보내버리기
    };

    if (!userInfo) {
        return <div>Loading...</div>; // 로딩 중일 때 표시
    }

    return (
        <div>
            <div className="profile-container">
                <div className="userImage"><FaUserCircle size={140} /></div>
                <div className="profile-description">
                    <div className="userName">{userInfo.name}</div>
                    <div className="userEmail">{userInfo.id}</div>
                    <div className="profile-option">
                        <div onClick={handleLogout}>로그아웃</div>
                        {/* 로그아웃 AJAX 요청 보내기*/}
                        <Link to="useredit" className="custom-link">
                            <div>정보수정</div>
                        </Link>

                    </div>
                </div>
            </div>
            <div className="user-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MyPagePage;