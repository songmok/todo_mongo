import React, { useEffect } from "react";
// react-redux 모듈
import { useSelector, useDispatch } from "react-redux";
// fire 라이브러리 모듈활용
import { loginUser, clearUser } from "./reducer/userSlice";
import firebase from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Todo from "./pages/Todo";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserInfo from "./pages/UserInfo";
import Header from "./components/Header";
export default function App() {
  // action 보내tj store.user.state를 업데이트
  const dispatch = useDispatch();
  // 내용 출력하기
  const user = useSelector((state) => state.user);
  // 로그인 상태 테스트
  useEffect(() => {
    // ------------------
    // 로그아웃
    // firebase.auth().signOut();
    // -------------------
    // fire의 사용자 로그인 변경 이벤트
    firebase.auth().onAuthStateChanged((userInfo) => {
      // firebase에 로그인 시 출력 정보 확인
      // console.log("로그인 정보 : ", userInfo);
      if (userInfo) {
        //로그인 하다
        //store.user.state에 저장한다. -> info를
        // 여기에서의 userInfo는 firebase 사이트에서 준 것
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        //로그아웃 하다
        //store.user.state를 초기화한다.
        dispatch(clearUser());
      }
    });
  });
  // useEffect(() => {}, [user]);
  // // 임시로 로그아웃을 컴포넌트가 마운트 될 때 실행
  // useEffect(() => {}, []);
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
