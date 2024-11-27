import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login"; // 로그인 페이지 import
import Signup from "./pages/Signup"; // 회원가입 페이지 import
import MainLayout from "./pages/Main";
import SummaryPage from "./pages/Summary";
import ProductPage from "./pages/Product";
import UserPatternPage from "./pages/UserPattern";
import CalendarPage from "./pages/Calendar";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Login />} />  {/* 기본 경로 */}
        <Route path="/signup" element={<Signup />} />  {/* 회원가입 경로 */}
        <Route path="/main/*" element={<MainLayout />} >  
            <Route path="chart/summary" element={<SummaryPage />} />
            <Route path="chart/products" element={<ProductPage />} />
            <Route path="chart/patterns" element={<UserPatternPage />} />
            <Route path="calendar/expenses" element={<CalendarPage />} />
        </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
