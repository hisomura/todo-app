import React from "react";
import Modal from "../common/Modal";
import { TodoList } from "../../lib/todo";

type Props = {
  open: boolean;
  todoList: TodoList;
  onDelete: () => void;
  onClose: () => void;
};

export default function DeleteTodoListModal(props: Props) {
  const onDelete = () => {
    props.onDelete();
    props.onClose();
  };
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="mb-6">Are you sure you want to delete "{props.todoList.name}" ?</div>
      <div className="flex justify-center">
        <button onClick={onDelete} type="button" className="rounded border px-4 py-2 mx-2">
          Delete
        </button>
        <button
          onClick={props.onClose}
          type="button"
          className="rounded border px-4 py-2 mx-2"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
