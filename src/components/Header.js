import React from "react";
import { Link, useNavigate } from "react-router-dom";
import firebase from "../firebase";
// userslice 에 저장된 user 정보를 활용
import { useSelector } from "react-redux";
const Header = () => {
  // 3. userSlice에 저장해 둔 user 정보 읽기
  //  useSlector(함수 전달)
  const user = useSelector((state) => state.user);
  // console.log("user", user);
  //로그아웃 기능
  // 5. 로그아웃 기능
  const navigate = useNavigate();
  const logOutFn = () => {
    // firebase 로그아웃
    firebase.auth().signOut();
    // 이동
    // navigate("/");
    navigate("/login");
  };
  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link
            to="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            TODO 웹서비스
          </Link>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/" className="nav-link px-2 text-secondary">
                Home
              </Link>
            </li>
            <li>
              <Link to="about/" className="nav-link px-2 text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="Todo/" className="nav-link px-2 text-white">
                Todo
              </Link>
            </li>
          </ul>
          <form
            className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
            role="search"
          >
            <input
              type="search"
              className="form-control form-control-dark text-bg-dark"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          {/* firebase 로그인 상태 마다 표현 */}
          {user.accessToken === "" ? (
            <div className="text-end">
              <Link to="/login" className="btn btn-outline-light me-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-warning">
                Sign-up
              </Link>
            </div>
          ) : (
            <div className="text-end">
              <button
                onClick={() => logOutFn()}
                className="btn btn-outline-light me-2"
              >
                {user.nickName} Logout
              </button>
              <Link to="/userinfo" className="btn btn-wraing">
                User info
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
