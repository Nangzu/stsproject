import "../css/mypage.css";
import { FaUserCircle } from "react-icons/fa";
import {Outlet,Link} from "react-router-dom";
import React from "react";

const MyPagePage = () => {
    return (
        <div>
            <div className="profile-container">
                <div className="userImage"><FaUserCircle size={140} /></div>
                <div className="profile-description">
                    <div className="userName">김석윤</div>
                    <div className="userEmail">rlatjrdbs123@mokpo.ac.kr</div>
                    <div className="profile-option">
                        <div>로그아웃</div>
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