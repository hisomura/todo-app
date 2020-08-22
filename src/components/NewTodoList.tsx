import React from "react";

type Props = {
  addNewTodoList: () => void;
};

export default function NewTodoList(props: Props) {

  return (
    <div className="mx-6 pt-2 z-0">
      <div className="w-96 shadow-xl rounded px-4 pb-4">
        <div className="pt-4">
          <h1 className="cursor-pointer " data-testid="add-new-todo-list" onClick={props.addNewTodoList}>+ New Todo List</h1>
        </div>
      </div>
    </div>
  );
}
