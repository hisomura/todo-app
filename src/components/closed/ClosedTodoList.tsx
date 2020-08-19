import ToggleFoldingButton from "../buttons/ToggleFoldingButton";
import ClosedTodoItem from "./ClosedTodoItem";
import React, { useReducer, useState } from "react";
import { useTodosHook } from "../../lib/todosHook";
import ClearAllModal from "./ClearAllModal";
import { MdClearAll } from "react-icons/md";

export default function ClosedTodoList() {
  const { closedTodos, clearAllClosedTodos } = useTodosHook();
  const [foldingClosedTodos, toggleFoldingClosedTodos] = useReducer((state: boolean) => !state, true);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
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
            <ClosedTodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
      <ClearAllModal open={modalOpen} onClear={clearAllClosedTodos} onClose={() => setModalOpen(false)} />
    </>
  );
}
