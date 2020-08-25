import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import OpenTodoList from "./open/OpenTodoList";
import ClosedTodoList from "./closed/ClosedTodoList";
import InputTodo from "./InputTodo";
import { TodoList } from "../lib/todo";
import { useRepositoryWriter } from "../repositories/ReposiotryProvider";
import { TodosProvider } from "../lib/todosHook";
import DeleteTodoListModal from "./todo-list/DeleteTodoListModal";

type Props = {
  list: TodoList;
  onDelete: (list: TodoList) => void;
};

export default function TodoListContainer(props: Props) {
  const writer = useRepositoryWriter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="mx-6 pt-2 z-0">
        <div className="w-64 shadow-xl rounded px-4 pb-4">
          <div className="pt-4 flex justify-between">
            <h1>{props.list.name}</h1>
            <span className="my-auto" onClick={() => setDeleteModalOpen(true)}>
              <MdClose />
            </span>
          </div>
          <TodosProvider writer={writer} todoList={props.list}>
            <InputTodo todoListId={props.list.id} />
            <OpenTodoList />
            <ClosedTodoList />
          </TodosProvider>
        </div>
      </div>
      <DeleteTodoListModal
        open={deleteModalOpen}
        todoList={props.list}
        onDelete={() => props.onDelete(props.list)}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
}
