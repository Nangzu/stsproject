import {create} from "zustand";
import axios from 'axios';


const useUserStore = create((set) => ({
    userInfo: null,
    setUserInfo: (user) => set({ userInfo: user }),
    //유저정보가져오기
    fetchUserInfo: async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/profile", {
                withCredentials: true, // 세션을 포함해서 요청
            });
            if (response.status === 200) {
                set({ userInfo: response.data }); // 유저 정보를 상태에 저장
            } else {
                console.error("유저를 찾을 수 없거나 인증 실패");
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    },
    //로그아웃
    logout: async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
            if (response.status === 200) {
                set({ userInfo: null }); // 유저 정보를 초기화
                console.log("로그아웃 성공");
            } else {
                console.error("로그아웃 실패");
            }
        } catch (error) {
            console.error("로그아웃 중 에러 발생:", error);
        }
    },
}));

export default useUserStore;
