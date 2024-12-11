import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../component/InputField";
import {BiUser} from "react-icons/bi";
import {RiLockPasswordLine} from "react-icons/ri";
import "../css/mypage.css"
import axios from "axios";

const UserEditPage = () => {
    const navigate = useNavigate();

    // 사용자 입력값 관리
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const handleGoBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };


    // 정보 수정 버튼 요청보내기
    const handleEditInfo = async () => {
        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post("/api/user/edit", {
                name,
                password,
            });

            if (response.status === 200) {
                alert("정보가 수정되었습니다.");
                navigate("/main/profile/mypage"); // 수정 완료 후 마이페이지로 이동
            }
        } catch (error) {
            console.error("정보 수정 요청 실패:", error.response?.data || error.message);
            alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div>
            <button
                onClick={handleGoBack}
                className="setting-button"
                id="back">
                돌아가기
            </button>
            <InputField
                Icon icon={BiUser}
                iconSize={20}
                label="이름"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <InputField
                Icon icon={RiLockPasswordLine}
                iconSize={20}
                label="비밀번호 변경"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
                Icon icon={RiLockPasswordLine}
                iconSize={20}
                label="비밀번호 변경 확인"
                placeholder="비밀번호 확인"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <div className="button-space">
                <button
                    onClick={handleEditInfo}
                    className="setting-button"
                    id ="edit">
                    정보 수정
                </button>
                <button
                    onClick={handleGoBack}
                    className="setting-button"
                    id = "signout">
                    회원탈퇴
                </button>
            </div>
        </div>
    );
};

export default UserEditPage;