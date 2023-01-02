import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Todo from "./pages/Todo";
import About from "./pages/About";
import Login from "./pages/Login";
import SingUp from "./pages/SingUp";
import Header from "./components/Header";
/*
  클래스/함수 컴포넌트(용도별로 2가지 케이스)
  내용 출력 전용, 데이터관리 용도

  클래스 형식으로 제작되는 것 class : TypeScript
  state 를 리랜더링(Re-rendering)
  Life-cycle : Mounte, Update, unMount...

  함수 형식으로 제작되는 것 function
  state 를 못쓰므로 화면 갱신 어렵다.
  useState() state 변경가능
  -------------------------
  Life-cycle 을 지원 안한다.
  useEffect() Life-cycle 체크가능

 */
export default function App() {
  /*
최초에 로컬에서 todoData를 읽어와서 todoData라는 useState를 초기화 해주어야 한다.
useState(초기값)
초기값: 로컬에서 불러와 채운다.
*/
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SingUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
