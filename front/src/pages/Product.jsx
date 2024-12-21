import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/product.css";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

const ProductPage = () => {
  const navigate = useNavigate();

  const [activeDetailTab, setActiveDetailTab] = useState("Deposit"); // 현재 활성화된 탭
  const [allProductData, setAllProductData] = useState({}); // 전체 상품 데이터
  const [productData, setProductData] = useState([]); // 현재 탭에 해당하는 데이터
  const [flippedCards, setFlippedCards] = useState({}); // 각 카드의 뒤집힘 상태 저장


  const detailTabs = [
    { id: "Deposit", label: "정기예금" },
    { id: "Savings", label: "적금금리" },
    { id: "PersonalLoans", label: "개인신용대출" },
    { id: "JeonSeLoans", label: "전세자금대출" },
    { id: "JooTackLoans", label: "주택담보대출"}
  ];
  const { userInfo, fetchUserInfo } = useUserStore();

  // 페이지가 처음 로드될 때 로그인된 유저 정보를 가져오기
  useEffect(() => {
    if (!userInfo) {  // userInfo가 없다면 유저 정보를 가져오기
      fetchUserInfo(navigate);
    }
  }, [userInfo, fetchUserInfo]);

  const toggleFlip = (index) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // 해당 카드의 뒤집힘 상태를 토글
    }));
  };

  // 처음에 모든 데이터를 가져옴
  useEffect(() => {
    if (userInfo && userInfo.id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/goods/${userInfo.id}`);
          // 카테고리별로 상품 데이터를 저장
          const categorizedData = {};
          response.data.forEach((product) => {
            const category = product.detail; // 상품의 카테고리 정보
            if (!categorizedData[category]) {
              categorizedData[category] = [];
            }
            categorizedData[category].push(product);
          });
          setAllProductData(categorizedData); // 전체 데이터를 상태로 저장
          setProductData(categorizedData["정기예금"] || []); // 기본적으로 '정기예금' 데이터 표시
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [userInfo]); // userInfo가 변경될 때마다 실행

  // activeDetailTab이 변경되면 해당 데이터 필터링
  useEffect(() => {
    if (allProductData) {
      // activeDetailTab에 해당하는 label을 포함하는 카테고리로 필터링
      const filteredData = [];
      Object.keys(allProductData).forEach((category) => {
        // 카테고리명에 activeDetailTab의 id가 포함되어 있는지 확인
        if (category.includes(detailTabs.find(tab => tab.id === activeDetailTab)?.label)) {
          filteredData.push(...allProductData[category]);
        }
      });
      setProductData(filteredData);
    }
  }, [activeDetailTab, allProductData]);

  // 5개까지만 표시
  const limitedProductData = productData.slice(0, 5);

  return (
    <div>
      <div className="detail-tabs">
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            className={`detail-tab-button ${activeDetailTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveDetailTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-page">
        {/* 상품 데이터 렌더링 */}
        <div className="product-list">
          <h2>{detailTabs.find((tab) => tab.id === activeDetailTab)?.label} 상품들</h2>
          <div className="product-cards">
            {limitedProductData.length > 0 ? (
                limitedProductData.map((product, index) => (
                    <div
                        key={index}
                        className={`product-card ${flippedCards[index] ? "flipped" : ""}`}
                        onClick={() => toggleFlip(index)} // 카드 클릭 시 상태 변경
                    >
                      <div className="card-front">
                        <h3>{product.b_name}</h3>
                        <p>이율: {product.mrate}</p>
                        <p>제한: {product.limit}</p>
                      </div>
                      <div className="card-back">
                        <p>상세: {product.detail}</p>
                      </div>
                    </div>
                ))
            ) : (
                <p>상품이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
