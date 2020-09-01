import React, { DragEventHandler } from "react";
import { Todo } from "../../lib/todo";
import { useTodosHook } from "../../lib/todosHook";
import { useDraggedData } from "../common/DraggedData";

type Props = {
  key: string;
  todo: Todo;
  index: number;
};

export default function OpenTodoItem(props: Props) {
  const { dropTargetIndex, closeTodo, setDropTargetIndex } = useTodosHook();
  const className = "flex py-2 " + (props.index === dropTargetIndex ? "border-t-2 border-blue-500" : "border-t");
  const draggedDataRef = useDraggedData();
  const onDragStart: DragEventHandler = (e) => {
    draggedDataRef.current = { type: "todo", todo: props.todo };
    e.dataTransfer!.effectAllowed = "move";
  };
  return (
    <li
      draggable={true}
      key={props.todo.id}
      className={className}
      data-testid="open-todo-item"
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        const rect = (e.target as HTMLLIElement).getBoundingClientRect();
        const middleHeight = rect.top + rect.height / 2;
        const isUpper = middleHeight > e.clientY;
        setDropTargetIndex(isUpper ? props.index : props.index + 1);
      }}
    >
      <input className="my-auto mr-2" type="checkbox" onClick={() => closeTodo(props.todo)} />
      <p className="text-sm">{props.todo.name}</p>
    </li>
  );
}
