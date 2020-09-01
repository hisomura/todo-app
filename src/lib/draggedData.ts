import { Todo, TodoList } from "./todo";

type DraggedTodo = {
  type: "todo";
  todo: Todo;
};

type DraggedTodoList = {
  type: "todo-list";
  todoList: TodoList;
};

type DraggedData = DraggedTodo | DraggedTodoList | null;

let draggedData: DraggedData = null;

function getDraggedData() {
  return draggedData;
}

function setDraggedData(data: DraggedData) {
  draggedData = data;
}

export { getDraggedData, setDraggedData };
