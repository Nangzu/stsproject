import React, { useState } from "react";
import "../css/login.css";
import image from "../assets/images/image.png";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../component/InputField";

const Signup = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [pwConfirm, setPwConfirm] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const signUpHandler = (e) => {
        e.preventDefault();
        if (password !== pwConfirm) {
            setPasswordError("패스워드가 일치하지 않습니다.");
            return;
        }
        setPasswordError("");

        axios
            .post("http://localhost:8080/",
                {
                    email: email,
                    name: name,
                    password: password,
                })
            .then((res) => {
                console.log("회원가입성공", res.data);
                navigate("/"); // 로그인 페이지로 이동
            })
            .catch((error) => {
                console.error('Error:', error)
            });

    };
    return (
        <div className="login">
            
            <img className="image" alt="Image" src={image} />
            <div className="sign-in-form-desktop">

                    <form className="sign-in-forms" onSubmit={signUpHandler}>

                        <InputField
                            label="이메일"
                            type="email"
                            value={email}
                            placeholder="이메일"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputField
                            label="이름"
                            type="text"
                            value={name}
                            placeholder="이름"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputField
                            label="비밀번호"
                            type="password"
                            value={password}
                            placeholder="비밀번호"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputField
                            label="비밀번호 확인"
                            type="password"
                            value={pwConfirm}
                            placeholder="비밀번호 확인"
                            onChange={(e) => setPwConfirm(e.target.value)}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <button type="submit" className="primary-button">회원가입</button>
                    </form>


            <div className="sign-up-offer">
                    <span className="description">계정이 이미 있나요? &nbsp;
                        <Link to="/">로그인</Link>
                    </span>
                </div>
            </div>
        </div>
        
    );
};

export default Signup;
