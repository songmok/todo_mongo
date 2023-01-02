import React from "react";

const Form = React.memo(
  ({ addTodoSubmit, todoValue, setTodoValue, addTodo }) => {
    // console.log("Form Rendering...");
    const changeTodoValue = (e) => {
      setTodoValue(e.target.value);
    };
    return (
      <div>
        <form className="flex pt-2" onSubmit={addTodoSubmit}>
          <input
            type="text"
            placeholder="할 일을 입력하세요"
            className="w-full px-3 py-2 mr-4 text-gray-500 border rounded shadow"
            value={todoValue}
            onChange={changeTodoValue}
          ></input>
          <input
            type="submit"
            onClick={addTodo}
            onSubmit={addTodo}
            className="p-2 text-blue-400 border-2 border-blue-400 rounded hover:text-white hover:bg-blue-400"
          ></input>
        </form>
      </div>
    );
  }
);

export default Form;
