import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";

type OpenTodo = {
  listId: string;
  id: string;
  name: string;
  closed: false;
  order: number;
};

type ClosedTodo = {
  listId: string;
  id: string;
  name: string;
  closed: true;
};

export type Todo = OpenTodo | ClosedTodo;

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
      return todos.map((t) => {
        return action.payload.ids.includes(t.id) ? { ...t, closed: true } : t;
      });
    },
    openTodos: (todos, action: { payload: { ids: string[] } }) => {
      const openTodosMap = new Map<string, Todo[]>();
      todos.forEach((t) => {
        if (t.closed) return;
        if (openTodosMap.has(t.listId)) {
          openTodosMap.get(t.listId)!.push(t);
        } else {
          openTodosMap.set(t.listId, [t]);
        }
      });

      return todos.map((t) => {
        if (!t.closed || !action.payload.ids.includes(t.id)) return t;

        // FIXME remove duplication
        if (openTodosMap.has(t.listId)) {
          openTodosMap.get(t.listId)!.push(t);
        } else {
          openTodosMap.set(t.listId, [t]);
        }

        return {
          ...t,
          closed: false,
          order: openTodosMap.get(t.listId)!.length,
        };
      });
    },
  },
});

export const { addTodo, deleteTodos, closeTodos, openTodos } = todosSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOpenTodos = (todos: Todo[]) => todos.filter((t) => !t.closed);

export default todosSlice.reducer;