import { act, renderHook } from "@testing-library/react-hooks";
import { getMockRepository } from "../../repositories/mockRepository";
import { useTodoLists } from "./todoListsHook";
import { Todo, TodoList } from "../../lib/todo";

describe("todoListsHook", () => {
  test("adds new todo list.", () => {
    const { writer } = getMockRepository([]);
    const { result } = renderHook(() => useTodoLists(writer, []));

    expect(result.current.todoLists).toEqual([]);
    act(() => result.current.addTodoList("test"));
    expect(result.current.todoLists.length).toBe(1);
    expect(result.current.todoLists[0].name).toBe("test");
  });

  test("deletes a todo list.", () => {
    const todoList = TodoList.create("test", []);
    const { writer } = getMockRepository([todoList]);
    const { result } = renderHook(() => useTodoLists(writer, [todoList]));

    expect(result.current.todoLists).toEqual([todoList]);
    act(() => result.current.deleteTodoList(todoList));
    expect(result.current.todoLists).toEqual([]);
  });

  test("moves a todo to another todo list.", () => {
    const list1 = TodoList.create("list1", [Todo.create("todo1-1")]);
    const list2 = TodoList.create("list2", [Todo.create("todo2-1")]);
    const { writer } = getMockRepository([list1, list2]);
    const { result } = renderHook(() => useTodoLists(writer, [list1, list2]));
    // const result = moveTodoToAnotherList(list1.todos[0], [list1, list2], list1, list2);
    act(() => result.current.moveTodo(list2.todos[0], list2, list1));

    expect(result.current.todoLists).toEqual<TodoList[]>([
      { ...list1, todos: [list1.todos[0], list2.todos[0]] },
      { ...list2, todos: [] },
    ]);
  });
});
