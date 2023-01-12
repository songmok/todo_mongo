// import { User } from "../../../server/model/UserModel";
import React from "react";
import { useSelector } from "react-redux";
import ListItem from "./ListItem";

const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  const user = useSelector((state) => state.user);
  return (
    <div>
      {todoData.map(
        (item) =>
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </div>
  );
});
export default List;
