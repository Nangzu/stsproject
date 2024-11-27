import React, { useState } from "react";
import avatarUiUnicornV2 from "../assets/images/AvatarUIUnicornV2.png";
import image from "../assets/images/image.png";
import "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = (e) => {
        e.preventDefault();
        
        axios
            .post("http://localhost:8080/", { 
                email : email,
                password : password 
            },{withCredentials:true}) // 백엔드 URL에 맞게 수정
            .then((res) => {
                if (res.data === "OK") // 백엔드에서 성공 시 응답 데이터 처리
                {
                    console.log(res.data);
                    <Link to="/main"></Link>
                }
                else {
                    alert("로그인에 실패했습니다. 다시 시도해주세요.");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("로그인 요청 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="login">
            <img className="image" alt="Image" src={image} />

            <div className="sign-in-form-desktop">
                {/*로고영역*/}
                <div className="UI-logo">
                    <img
                        className="avatar-UI-unicorn"
                        alt="Avatar UI unicorn"
                        src={avatarUiUnicornV2}
                    />
                    <div className="text-wrapper">슬기로운 금융생활</div>
                </div>

                <div className="sign-in-forms">
                    <div className="input-configurator">
                        <label className="text-wrapper-2">이메일</label>
                        <input
                            type="email"
                            className="regular-input-double"
                            value={email}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}  //상태 업데이트해주기
                        />
                    </div>
                    <div className="input-configurator">
                        <label className="text-wrapper-2">비밀번호</label>
                        <input
                            type="password"
                            className="regular-input-double"
                            value={password}
                            placeholder="Enter password"
                            onChange={(e) =>setPassword(e.target.value)}
                        />
                    </div>
                    <button className="primary-button" onClick={handleLogin}>로그인</button>

                </div>

                <div className="sign-up-offer">
                    <span className="description">계정이 없으신가요?  </span>
                    <span className="description-2">
                        <Link to="/signup">회원가입</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};


export default Login; // 'default'로 변경