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
    deleteTodos: (todos, action: { payload: { ids: string[] } }) => {
      return todos.filter((t) => !action.payload.ids.includes(t.id));
    },
    closeTodos: (todos, action: { payload: { ids: string[] } }) => {
      return todos.map((t) => (action.payload.ids.includes(t.id) ? { ...t, closed: true } : t));
    },
    openTodos: (todos, action: { payload: { ids: string[] } }) => {
      return todos.map((t) => (action.payload.ids.includes(t.id) ? { ...t, closed: false } : t));
    },

    // TODO FIX implementation
    moveTodos: (
      todos,
      action: { payload: { targetIds: string[]; fromListId: string; toListId: string; index: number } }
    ) => {
      if (action.payload.fromListId === action.payload.toListId) {
        // TODO implement
        return;
      }
      const fromListTodos = todos.filter((t) => t.listId === action.payload.fromListId);
      const toListTodos = todos.filter((t) => t.listId === action.payload.toListId);

      const targetTodos = fromListTodos.filter((t) => {
        const isTarget = action.payload.targetIds.includes(t.id);
        if (isTarget && t.listId !== action.payload.fromListId)
          throw new Error(`todo ${t.id} doesn't belong to todo list ${action.payload.fromListId}`);
        return isTarget;
      });

      toListTodos.sort((a, b) => a.order - b.order);
      toListTodos.splice(action.payload.index, 0, ...targetTodos)
      toListTodos.forEach((t, index) => {
        t.order = index + 1
        t.listId = action.payload.toListId
      })
      fromListTodos.filter(t => t.listId === action.payload.fromListId).forEach((t, index) => {
        t.order = index + 1
      })
    },
  },
});

export const { addTodo, deleteTodos, closeTodos, openTodos, moveTodos } = todosSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOpenTodos = (todos: Todo[]) => todos.filter((t) => !t.closed);

export default todosSlice.reducer;