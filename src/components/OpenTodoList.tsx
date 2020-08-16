import OpenTodoItem from "./OpenTodoItem";
import React, { DragEventHandler } from "react";
import { useTodoListFromContext } from "./todoListHook";

const preventDefault: DragEventHandler = (event) => event.preventDefault();

function inRect(rect: DOMRect, clientX: number, clientY: number) {
  return rect.left <= clientX && clientX <= rect.right && rect.top <= clientY && clientY <= rect.bottom;
}

export default function OpenTodoList() {
  const { openTodos, dropTargetIndex, setDropTargetIndex, moveTodo } = useTodoListFromContext();

  return (
    <div
      data-testid="open-todo-area"
      onDragOver={preventDefault}
      onDragLeave={(e) => {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        if (inRect(rect, e.clientX, e.clientY)) return;
        setDropTargetIndex(null);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const todoKey = e.dataTransfer?.getData("todo-key");
        const todo = openTodos.find((t) => t.key === todoKey);
        if (todo) moveTodo(todo);
      }}
    >
      <ul>
        {openTodos.map((todo, index) => (
          <OpenTodoItem key={todo.key} todo={todo} index={index} />
        ))}
        <li className={dropTargetIndex === openTodos.length ? "border-t-2 border-blue-500" : "border-t"} />
      </ul>
    </div>
  );
}