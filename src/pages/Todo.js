import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "../components/Form";
import List from "../components/List";
import Loading from "../components/Loding";
import LoadingSpinner from "../components/LoadingSpinner";
// MongoDB 에서 목록을 읽어옴
// 로컬스토리지에 내용을 읽어온다
// let initTodo = localStorage.getItem("todoData");
// initTodo = initTodo ? JSON.parse(initTodo) : [];
const Todo = () => {
  // MongoDB 에서 초기값 읽어서 세팅
  // axios 및 useEffect 를 이용한다
  // const [todoData, setTodoData] = useState(initTodo);
  const [loading, setLoading] = useState(false);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  // 2. 로그인 상태 파악
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  // console.log("user", user);
  useEffect(() => {
    if (user.accessToken === "") {
      // 로그인이 안 된 경우
      alert("로그인 하셔요");
      navigate("/login");
    } else {
      // 로그인이 된 경우
    }
  }, [user]);
  // 목록 정렬 기능
  const [sort, setSort] = useState("최신순");
  useEffect(() => {
    setSkip(0);
    getList(search, 0);
  }, [sort]);
  //검색 기능
  const [search, setSearch] = useState("");
  const searchHandler = () => {
    getList(search);
  };
  // axios 를 이용해서 서버에 API 호출
  // 전체 목록 호출 메서드
  const getList = (_word = "", _stIndex = 0) => {
    setSkip(0);
    // 로딩창 보여주기
    setLoading(true);
    // 처음에 버튼 안보이게 처리
    setSkipToggle(false);
    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data);
        // 초기 할일데이터 셋팅
        if (response.data.success) {
          setTodoData(response.data.initTodo);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(response.data.initTodo.length);
          // console.log(response.data.total);

          // 목록을 DB 에서 호출하면 전체 등록글 수를 받아서
          // 비교한다.
          if (response.data.total > 5) {
            setSkipToggle(true);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getListGo = (_word = "", _stIndex = 0) => {
    // 로딩창 보여주기
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data);
        // 초기 할일데이터 셋팅
        if (response.data.success) {
          const newArr = response.data.initTodo;
          setTodoData([...todoData, ...newArr]);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(skip + newArr.length);
          // 목록을 DB에서 호출하면 전체 등록글 수를 받아서 비교한다.
          if (response.data.total > 5) {
            setSkipToggle(true);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [skip, setSkip] = useState(0);
  const [skipToggle, setSkipToggle] = useState(true);
  const getListMore = () => {
    getListGo(search, skip);
  };
  useEffect(() => {
    getList("", skip);
    // 초기데이터를 컴포넌트가 마운트 될때 한번 실행한다
  }, []);
  const deleteClick = useCallback(
    (id) => {
      if (window.confirm("정말 삭제할건가요?")) {
        setLoading(true);
        let body = {
          id: id,
        };
        axios
          .post("/api/post/delete", body)
          .then((res) => {
            console.log(res);
            const nowTodo = todoData.filter((item) => item.id !== id);
            // axios  를 이용해서 MongoDB 삭제 진행
            setTodoData(nowTodo);
            // localStorage.setItem("todoData", JSON.stringify(nowTodo));
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
      }
    },
    [todoData]
  );
  const addTodoSubmit = (event) => {
    event.preventDefault();
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("내용을 입력하세요.");
      setTodoValue("");
      return;
    }
    const addTodo = {
      id: Date.now(), // 배열 키
      title: todoValue, // 할 일 입렵창 내용추가
      completed: false, // 할 일 추가 될 대 아직 완료한 것은 아니다
      // 1. DB 저장 : Server/Model/TodoModel Schema 업데이트(ObjectID)
      uid: user.uid, // 여러명의 사용자 구분용도
    };
    // axios 로 MongoDB 에 항목 추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          // setTodoData([...todoData, addTodo]);
          // 검색어 초기화

          // 로딩
          setLoading(true);
          setTodoValue("");
          // 목록 재호출
          getList("", 0);
          // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));
          alert("할 일이 등록되었습니다");
        } else {
          alert("할 일이 등록되지 않았습니다");
        }
        setLoading(false);
        // 검색어 초기화

        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteAllClick = () => {
    // axios 를 이용하여 MongoDB 목록 비워줌
    setLoading(true);
    axios
      .post("/api/post/deleteall")
      .then(() => {
        setTodoData([]);
        alert("삭제할까요?");
        setLoading(false);
        setSkip(0);
      })
      .catch((err) => console.log(err));
    // localStorage.clear();
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full p-6 m-4 bg-white shadow">
        <div className="flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>
        <div className="flex justify-between mb-3">
          <DropdownButton
            id="dropdown-basic-button"
            title={sort}
            variant="outline-secondary"
          >
            <Dropdown.Item onClick={() => setSort("최신순")}>
              최신순
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("과거순")}>
              과거순
            </Dropdown.Item>
          </DropdownButton>
          <div>
            <label className="m-2">검색어</label>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="border-2"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                } else {
                  // setSearch("");
                }
              }}
            />
          </div>
        </div>
        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        {skipToggle && (
          <div className="flex justify-end ">
            <button
              className="p-2 text-blue-400 border-2 border-blue-400 rounded hover:text-white hover:bg-blue-400"
              onClick={() => getListMore()}
            >
              더보기
            </button>
          </div>
        )}
        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default Todo;
