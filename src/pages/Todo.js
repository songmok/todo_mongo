import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";
// MongoDB 에서 목록을 읽어옴
// 로컬스토리지에 내용을 읽어온다
// let initTodo = localStorage.getItem("todoData");
// initTodo = initTodo ? JSON.parse(initTodo) : [];
const Todo = () => {
  // MongoDB 에서 초기값 읽어서 세팅
  // axios 및 useEffect 를 이용한다
  // const [todoData, setTodoData] = useState(initTodo);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  // axios 를 이용해서 서버에 API 호출
  useEffect(() => {
    axios
      .post("/api/post/list")
      .then((res) => {
        // console.log(res.data);
        // 초기 할일데이터 세팅
        if (res.data.success) {
          setTodoData(res.data.initTodo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 초기데이터를 컴포넌트가 마운트 될때 한번 실행한다
  }, []);
  const deleteClick = useCallback(
    (id) => {
      if (window.confirm("정말 삭제할건가요?")) {
        let body = {
          id: id,
        };
        axios
          .post("/api/pos/delete", body)
          .then((res) => {
            console.log(res);
            const nowTodo = todoData.filter((item) => item.id !== id);
            // axios  를 이용해서 MongoDB 삭제 진행
            setTodoData(nowTodo);
            // localStorage.setItem("todoData", JSON.stringify(nowTodo));
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
    // let str = todoValue;
    // str = str.replace(/^\s+|\s+$/gm, "");
    // if (str.length === 0) {
    //   alert("내용을 입력하세요.");
    //   setTodoValue("");
    //   return;
    // }
    const addTodo = {
      id: Date.now(),
      title: todoValue,
      completed: false,
    };
    // axios 로 MongoDB 에 항목 추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          setTodoData([...todoData, addTodo]);
          setTodoValue("");
          // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));
          alert("할 일이 등록되었습니다");
        } else {
          alert("할 일이 등록되지 않았습니다");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteAllClick = () => {
    // axios 를 이용하여 MongoDB 목록 비워줌
    axios
      .post("/api/post/deleteall")
      .then(() => {
        setTodoData([]);
        alert("삭제할까요?");
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
        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
    </div>
  );
};
export default Todo;
