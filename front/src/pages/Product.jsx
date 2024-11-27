import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/product.css";

const ProductPage = () => {
  const [activeDetailTab, setActiveDetailTab] = useState("Deposit"); // 현재 활성화된 탭
  const [allProductData, setAllProductData] = useState({}); // 전체 상품 데이터
  const [productData, setProductData] = useState([]); // 현재 탭에 해당하는 데이터

  const detailTabs = [
    { id: "Deposit", label: "예금" },
    { id: "Savings", label: "적금" },
    { id: "Loans", label: "대출" },
    { id: "PensionSavings", label: "연금처죽" }
  ];

  // 처음에 모든 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = 
        await axios
        .get("http://localhost:5000/products");
        setAllProductData(response.data); // 전체 데이터를 상태로 저장
        setProductData(response.data["Deposit"]); // 기본적으로 Deposit 데이터 표시
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // activeDetailTab이 변경되면 해당 데이터 필터링
  useEffect(() => {
    if (allProductData[activeDetailTab]) {
      setProductData(allProductData[activeDetailTab]);
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
            {limitedProductData.map((product, index) => (
              <div key={index} className="product-card">
                <h3>{product.name}</h3>
                <p>이율: {product.interestRate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
