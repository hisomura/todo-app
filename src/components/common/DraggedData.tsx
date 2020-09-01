import React, { useRef } from "react";
import { Todo, TodoList } from "../../lib/todo";

type DraggedTodo = {
  type: "todo";
  todo: Todo;
};

type DraggedTodoList = {
  type: "todo-list";
  todoList: TodoList;
};

type DraggedData = DraggedTodo | DraggedTodoList | null;

const DraggedDataContext = React.createContext<undefined | React.MutableRefObject<DraggedData>>(undefined);

function useDraggedData() {
  const context = React.useContext(DraggedDataContext);
  if (context === undefined) {
    throw new Error("useDraggedData() must be used within a DraggedDataProvider");
  }

  return context;
}

function DraggedDataProvider(props: { children: any }) {
  const draggedData = useRef<DraggedData>(null);
  return <DraggedDataContext.Provider value={draggedData}>{props.children}</DraggedDataContext.Provider>;
}

export { DraggedDataProvider, useDraggedData };
