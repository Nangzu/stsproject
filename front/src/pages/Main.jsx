import React, { useState } from "react";
import {Outlet, useNavigate, useLocation } from "react-router-dom";
import "../css/main.css";
import chartIcon from "../assets/images/chart.svg"
import calendarIcon from "../assets/images/calendar.svg";
import profileIcon from "../assets/images/profile.svg";
import avatarUiUnicornV2 from "../assets/images/AvatarUIUnicornV2.png";

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedMainTab, setSelectedMainTab] = useState("Chart")

    const mainTabs = [
        { id: "Chart", icon: chartIcon },
        { id: "Calendar", icon: calendarIcon },
        { id: "Profile", icon: profileIcon },
    ];

    const subTabs = {
        Chart: [
            { id: "summary", label: "요약" },
            { id: "products", label: "금융상품 보기" },
            { id: "patterns", label: "소비패턴" },
        ],
        Calendar: [{ id: "expenses", label: "지출 및 소비" }],
        Profile: [
            { id: "mypage", label: "내 정보" },
        ],
    };

    const handleMainTabClick = (tab) => {
        setSelectedMainTab(tab);
        const firstSubTab = subTabs[tab][0].id;
        navigate(`/main/${tab.toLowerCase()}/${firstSubTab}`);
    };
    const handleSubTabClick = (subTabId) => {
        navigate(`/main/${activeMainTab.toLowerCase()}/${subTabId}`);
    };


    const activeMainTab = mainTabs.find((tab) =>
        location.pathname.includes(tab.id.toLowerCase())
    )?.id;

    const activeSubTabs = subTabs[activeMainTab] || [];


    return (
        <div className="main-layout">

            <div className="main-tabs"> {/*왼쪽주탭*/}
                <div className="logo">
                    <img
                        className="avatar-UI-unicorn"
                        alt="Avatar UI unicorn"
                        src={avatarUiUnicornV2}
                    />
                </div>
                <div className="tabs">
                    {mainTabs.map((tab) => (
                        <div key={tab.id} className="tab-container">
                            <button
                                key={tab.id}
                                className={`main-tab-button ${selectedMainTab === tab.id ? "active" : ""}`}
                                onClick={() => handleMainTabClick(tab.id)}>
                                <img src={tab.icon} alt={`${tab.id} Icon`} className="tab-icon" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="content-area">
                <div className="sub-tabs">
                    {activeSubTabs.map((subTab) => (
                        <button
                            key={subTab.id}
                            className={`sub-tab-button ${location.pathname.includes(subTab.id) ? "active" : ""
                                }`}
                            onClick={() => handleSubTabClick(subTab.id)}
                        >
                            {subTab.label}
                        </button>
                    ))}
                </div>
                <div className="content">
                    {/*여기다 AJAX요청하고 컴포넌트도 넣고하기*/}
                    <Outlet />
                </div>
            </div>
        </div>

    );
};
export default MainLayout;