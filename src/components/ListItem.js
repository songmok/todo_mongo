import axios from "axios";
import React, { useState } from "react";
const ListItem = React.memo(({ item, todoData, setTodoData, deleteClick }) => {
  //   console.log("ListItem Rendering...");
  //   현재 편집 중인지 아닌지를 관리하는 State 생성
  //   isEditing    false   라면 목록보여줌.
  //   isEditing    true    라면 편집보여줌.
  const [isEditing, setIsEditing] = useState(false);
  // 제목을 출력 하고 변경 하는 State
  // 편집창에는 타이틀이 먼저 작성되어야 있어야 하므로
  const [editedTitle, setEditedTitle] = useState(item.title);
  // const deleteClick = (id) => {
  //   // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
  //   const nowTodo = todoData.filter((item) => item.id !== id);
  //   // console.log("클릭", nowTodo);
  //   setTodoData(nowTodo);
  // };
  // 편집창 내용 갱신 처리

  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };
  const toggleClick = (id) => {
    // map 을 통해서 todoData의 complete를 업데이트해보자
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        // if(item.id === true) {
        //   item.completed = false;
        // }else{
        //   item.completed = true;
        // }
        // 할 일 목록의 값을 변경한다.
        item.completed = !item.completed;
      }
      return item;
    });
    let body = {
      id: todoId,
      completed: item.completed,
    };
    // axios를 통해 mongoDB complete 업데이트
    // then() : 서버에서 회신(응답)이 왔을 때 처리
    // catch(): 서버세엇 응답이 없을 때
    axios
      .post("/api/post/updatetoggle", body)
      .then((res) => {
        console.log(res);
        setTodoData(updateTodo);
      })
      .catch((err) => {
        console.log(err);
      });
    // 로컬에 저장
    // localStorage.setItem("todoData", JSON.stringify(updateTodo));
  };
  //  현재 item.id 에 해당하는 것만 업데이트한다.
  const todoId = item.id;

  const updateTitle = () => {
    let str = editedTitle;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      setEditedTitle("");
      alert("제목을 입력하세요.");
      return;
    }
    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 ID 와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정하겠다.
        item.title = editedTitle;
      }
      return item;
    });
    // 데이터 갱신
    // axios 를 이용해서 MongoDB 타이틀업데이트
    let body = {
      id: todoId,
      title: editedTitle,
    };
    axios
      .post("/api/post/updatetitle", body)
      .then((response) => {
        // 응답 결과 출력
        console.log(response.data);
        setTodoData(tempTodo);
        // 목록창으로 이동
        setIsEditing(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // 로컬에 저장(DB 저장)
    // localStorage.setItem("todoData", JSON.stringify(tempTodo));
  };
  // 날짜 출력
  const showTime = (_timestamp) => {
    const WEEKDAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const date = new Date(_timestamp);
    let hours = date.getHours();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? "0" + hours : hours;

    // 분 표시
    let time = date.getFullYear();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let months = date.getMonth();
    months = months + 1 < 10 ? "0" + (months + 1) : months + 1;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    time += "/";
    time += months;
    time += "/";
    time += date.getDate();
    time += "/";
    time += WEEKDAY[date.getDay()];
    time += " ";
    time += hours;
    time += ":";
    time += minutes;
    time += ":";
    time += seconds;
    time += " ";
    time += ampm;
    return time;
  };
  if (isEditing) {
    // 편집일때 JSX 리턴
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-white border rounded">
        <div className="items-center">
          <input
            type="text"
            className="w-full px-3 py-2 mr-4 text-gray-500 bg-pink-100 border rounded"
            onChange={editChange}
          />
        </div>
        <div className="items-center">
          <button className="px-4 py-2" onClick={updateTitle}>
            Update
          </button>
          <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
            Close
          </button>
        </div>
      </div>
    );
  } else {
    // 목록일때 JSX 리턴
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-white border rounded">
        <div className="items-center">
          <span>{showTime(item.id)}</span>
          <input
            type="checkbox"
            defaultChecked={item.completed}
            onChange={() => toggleClick(item.id)}
            value={editedTitle}
          />
          <span className={item.completed ? "line-through" : "none"}>
            {item.title}
          </span>
        </div>
        <div className="items-center">
          <button
            className="px-4 py-2"
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(item.title);
            }}
          >
            Edit
          </button>
          <button className="px-4 py-2" onClick={() => deleteClick(item.id)}>
            x
          </button>
        </div>
      </div>
    );
  }
});
export default ListItem;
