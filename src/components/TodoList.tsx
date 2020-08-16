import React, { DragEventHandler, KeyboardEventHandler, useReducer, useState } from "react";
import { MdClearAll } from "react-icons/md";
import { Todo } from "../lib/todo";
import ToggleFoldingButton from "./ToggleFoldingButton";
import OpenTodoItem from "./OpenTodoItem";
import ClosedTodoItem from "./ClosedTodoItem";
import ClearAllModal from "./ClearAllModal";
import { useTodoListFromContext } from "./todoListHook";

const preventDefault: DragEventHandler = (event) => event.preventDefault();

function inRect(rect: DOMRect, clientX: number, clientY: number) {
  return rect.left <= clientX && clientX <= rect.right && rect.top <= clientY && clientY <= rect.bottom;
}

export default function TodoList() {
  const {
    openTodos,
    closedTodos,
    dropTargetIndex,
    closeTodo,
    reopenTodo,
    addTodo,
    clearTodo,
    setDropTargetIndex,
    moveTodo,
    clearAllClosedTodos,
  } = useTodoListFromContext();

  const [foldingClosedTodos, toggleFoldingClosedTodos] = useReducer((state: boolean) => !state, true);
  const [modalOpen, setModalOpen] = useState(false);

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== "Enter") return;
    if (event.currentTarget.value === "") return;
    addTodo(Todo.create(event.currentTarget.value));
    event.currentTarget.value = "";
  };

  return (
    <>
      <div className="max-w-xl mx-auto pt-2 z-0">
        <div className="shadow-xl rounded px-4 pb-4">
          <div className="pt-4">
            <h1>Todo</h1>
          </div>
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
              <li className="py-2">
                <label htmlFor="new-todo" hidden={true}>
                  Input new todo.
                </label>
                + <input id="new-todo" className="focus:outline-none ml-1 w-11/12" onKeyDown={onKeyDown} type="text" />
              </li>
              {openTodos.map((todo, index) => (
                <OpenTodoItem
                  key={todo.key}
                  todo={todo}
                  index={index}
                  closeTodo={closeTodo}
                  isNext={index === dropTargetIndex}
                  setNextIndex={setDropTargetIndex}
                />
              ))}
              <li className={dropTargetIndex === openTodos.length ? "border-t-2 border-blue-500" : "border-t"} />
            </ul>
          </div>

          <div data-testid="closed-todo-area">
            <div className="mt-2 py-1 flex justify-between">
              <h2>closed</h2>
              <div
                className="ml-auto mr-2"
                hidden={foldingClosedTodos || closedTodos.length === 0}
                onClick={() => setModalOpen(true)}
                data-testid="clear-all-closed-todos"
              >
                <MdClearAll />
              </div>
              <ToggleFoldingButton folding={foldingClosedTodos} onClick={toggleFoldingClosedTodos} />
            </div>
            <ul className="divide-y" hidden={foldingClosedTodos}>
              {closedTodos.map((todo) => (
                <ClosedTodoItem key={todo.key} todo={todo} reopenTodo={reopenTodo} clearTodo={clearTodo} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ClearAllModal open={modalOpen} onClear={clearAllClosedTodos} onClose={() => setModalOpen(false)} />
    </>
  );
}
