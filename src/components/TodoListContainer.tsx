import React from "react";
import { MdClose } from "react-icons/md";
import OpenTodoList from "./open/OpenTodoList";
import ClosedTodoList from "./closed/ClosedTodoList";
import InputTodo from "./InputTodo";
import { TodoList } from "../lib/todo";
import { useRepositoryWriter } from "../repositories/ReposiotryProvider";
import { TodosProvider } from "../lib/todosHook";
import { useModal } from "./common/Modal";

type Props = {
  list: TodoList;
  onDelete: (list: TodoList) => void;
};

function openDeleteModal(props: Props) {
  const { open, close } = useModal();
  const onDelete = () => {
    props.onDelete(props.list);
    close();
  }
  const modal = (
    <>
      <div className="mb-6">Are you sure you want to delete "{props.list.name}" ?</div>
      <div className="flex justify-center">
        <button
          onClick={onDelete}
          type="button"
          className="rounded border px-4 py-2 mx-2"
        >
          Delete
        </button>
        <button onClick={close} type="button" className="rounded border px-4 py-2 mx-2">
          Cancel
        </button>
      </div>
    </>
  );
  return () => open(modal);
}

export default function TodoListContainer(props: Props) {
  const writer = useRepositoryWriter();

  return (
    <>
      <div className="mx-6 pt-2 z-0">
        <div className="w-64 shadow-xl rounded px-4 pb-4">
          <div className="pt-4 flex justify-between">
            <h1>{props.list.name}</h1>
            <button
              className="my-auto focus:outline-none"
              onClick={openDeleteModal(props)}
              data-testid="open-delete-todo-list-modal"
            >
              <MdClose />
            </button>
          </div>
          <TodosProvider writer={writer} todoList={props.list}>
            <InputTodo todoListId={props.list.id} />
            <OpenTodoList />
            <ClosedTodoList />
          </TodosProvider>
        </div>
      </div>
    </>
  );
}
