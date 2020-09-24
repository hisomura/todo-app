import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";

export type Todo = {
  listId: string;
  id: string;
  name: string;
  closed: boolean;
  order: number;
};

export const todosSlice = createSlice({
  name: "todos",
  initialState: [] as Todo[],
  reducers: {
    addTodo: (todos, action: { payload: string }) => {
      todos.push({
        listId: uuidV4(),
        id: uuidV4(),
        name: action.payload,
        closed: false,
        order: 3,
      });
    },
    deleteTodo: (todos, action: { payload: { ids: string[] } }) => {
      return todos.filter((t) => !action.payload.ids.includes(t.id));
    },
  },
});

export const { addTodo, deleteTodo } = todosSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOpenTodos = (todos: Todo[]) => todos.filter((t) => !t.closed);

export default todosSlice.reducer;