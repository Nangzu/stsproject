import React, { useState } from "react";
import "../App.css";
import image from "../assets/images/image.png";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

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
            <form onSubmit={signUpHandler}>
                <div className="sign-in-forms">
                    <div className="input-configurator">
                        <label className="text-wrapper-2">이메일</label>
                        <input
                            type="email"
                            value={email}
                            className="regular-input-double"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-configurator">
                        <label className="text-wrapper-2">이름</label>
                        <input
                            type="text"
                            value={name}
                            className="regular-input-double"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-configurator">
                        <label className="text-wrapper-2">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            className="regular-input-double"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-configurator">
                        <label className="text-wrapper-2">비밀번호 확인</label>
                        <input
                            type="password"
                            value={pwConfirm}
                            className="regular-input-double"
                            placeholder="Enter password Confirm"
                            onChange={(e) => setPwConfirm(e.target.value)}
                            required
                        />
                    </div>
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <button type="submit" className="primary-button" >회원가입</button>
                    
                </div>
                </form>
                <div className="sign-up-offer">
                    <span className="description">계정이 이미 있나요? </span>
                    <span className="description-2">
                        <Link to="/">로그인</Link>
                    </span>
                </div>
            </div>
        </div>
        
    );
};

export default Signup;
