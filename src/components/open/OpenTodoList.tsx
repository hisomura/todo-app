import OpenTodoItem from "./OpenTodoItem";
import React, { DragEventHandler } from "react";
import { useTodosHook } from "../../lib/todosHook";
import { useDraggedData } from "../common/DraggedData";

const preventDefault: DragEventHandler = (event) => event.preventDefault();

function inRect(rect: DOMRect, clientX: number, clientY: number) {
  return rect.left <= clientX && clientX <= rect.right && rect.top <= clientY && clientY <= rect.bottom;
}

export default function OpenTodoList() {
  const { openTodos, dropTargetIndex, setDropTargetIndex, moveTodo } = useTodosHook();
  const draggedDataRef = useDraggedData();

  return (
    <div
      data-testid="open-todo-area"
      onDragOver={preventDefault}
      onDragLeave={(e) => {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        if (inRect(rect, e.clientX, e.clientY)) return;
        // FIXME
        setDropTargetIndex(null);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(draggedDataRef.current);
        console.log(draggedDataRef);
        if (draggedDataRef.current?.type === "todo") {
          moveTodo(draggedDataRef.current.todo);
          draggedDataRef.current = null;
        }
      }}
    >
      <ul>
        {openTodos.map((todo, index) => (
          <OpenTodoItem key={todo.id} todo={todo} index={index} />
        ))}
        <li className={dropTargetIndex === openTodos.length ? "border-t-2 border-blue-500" : "border-t"} />
      </ul>
    </div>
  );
}
