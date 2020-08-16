import React, { DragEventHandler } from "react";
import { Todo } from "../lib/todo";
import { useTodoListFromContext } from "./todoListHook";

type Props = {
  key: string;
  todo: Todo;
  index: number;
};

export default function OpenTodoItem(props: Props) {
  const { dropTargetIndex, closeTodo, setDropTargetIndex } = useTodoListFromContext();
  const className = "flex py-2 " + (props.index === dropTargetIndex ? "border-t-2 border-blue-500" : "border-t");
  const onDragStart: DragEventHandler = (e) => {
    e.dataTransfer!.setData("todo-id", props.todo.id);
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
      <p>{props.todo.name}</p>
    </li>
  );
}
