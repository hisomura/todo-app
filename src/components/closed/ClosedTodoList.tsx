import ToggleFoldingButton from "../buttons/ToggleFoldingButton";
import ClosedTodoItem from "./ClosedTodoItem";
import React, { useReducer } from "react";
import { useTodosHook } from "../../lib/todosHook";
import { MdClearAll } from "react-icons/md";
import { useModal } from "../common/Modal";

function openClearAllClosedTodosModal() {
  const { clearAllClosedTodos } = useTodosHook();
  const { open, close } = useModal();
  const onClear = () => {
    clearAllClosedTodos();
    close();
  };
  const modal = (
    <>
      <div className="mb-6">Are you sure you want to clear all closed todos?</div>
      <div className="flex justify-center">
        <button onClick={onClear} type="button" className="rounded border px-4 py-2 mx-2">
          Clear
        </button>
        <button onClick={close} type="button" className="rounded border px-4 py-2 mx-2">
          Cancel
        </button>
      </div>
    </>
  );
  return () => open(modal);
}

export default function ClosedTodoList() {
  const { closedTodos } = useTodosHook();
  const [foldingClosedTodos, toggleFoldingClosedTodos] = useReducer((state: boolean) => !state, true);

  return (
    <>
      <div data-testid="closed-todo-area">
        <div className="mt-2 py-1 flex justify-between">
          <h2>closed</h2>
          <div
            className="ml-auto mr-2"
            hidden={foldingClosedTodos || closedTodos.length === 0}
            onClick={openClearAllClosedTodosModal()}
            data-testid="clear-all-closed-todos"
          >
            <MdClearAll />
          </div>
          <ToggleFoldingButton folding={foldingClosedTodos} onClick={toggleFoldingClosedTodos} />
        </div>
        <ul className="divide-y" hidden={foldingClosedTodos}>
          {closedTodos.map((todo) => (
            <ClosedTodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
    </>
  );
}
