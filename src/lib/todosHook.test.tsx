import { act, renderHook } from "@testing-library/react-hooks";
import { useTodos } from "./todosHook";
import { Todo } from "./todo";
import { getMockRepository } from "../repositories/mockRepository";

describe("todosHook", () => {
  test("adds a todo", () => {
    const todoList = { id: "test", name: "foobar", todos: [] };
    const { writer } = getMockRepository([todoList]);
    const { result } = renderHook(() => useTodos(writer, todoList));
    expect(result.current.openTodos).toEqual([]);

    const todo = Todo.create("test");
    act(() => result.current.addTodo(todo));
    expect(result.current.openTodos).toEqual([todo]);
    expect(result.current.closedTodos).toEqual([]);
  });

  test("closes a todo", () => {
    const todo = Todo.create("test");
    const todoList = { id: "test", name: "foobar", todos: [todo] };
    const { writer } = getMockRepository([todoList]);
    const { result } = renderHook(() => useTodos(writer, todoList));

    act(() => result.current.closeTodo(todo));
    expect(result.current.openTodos).toEqual([]);
    expect(result.current.closedTodos).toEqual([todo]);
  });

  test("reopens a todo", () => {
    const todo = Todo.create("test", true);
    const todoList = { id: "test", name: "foobar", todos: [todo] };
    const { writer } = getMockRepository([todoList]);
    const { result } = renderHook(() => useTodos(writer, todoList));

    act(() => result.current.reopenTodo(todo));
    expect(result.current.openTodos).toEqual([todo]);
    expect(result.current.closedTodos).toEqual([]);
  });

  function createMockRepository() {
    const todo1 = Todo.create("test1", false);
    const todo2 = Todo.create("test2", true);
    const todo3 = Todo.create("test3", true);
    const todo4 = Todo.create("test4", true);
    const todoList = { id: "test", name: "foobar", todos: [todo1, todo2, todo3, todo4] };
    const { writer } = getMockRepository([todoList]);

    return { writer, todoList, todo1, todo2, todo3, todo4 };
  }

  test("clears a todo", () => {
    const { writer, todoList, todo1, todo2, todo3, todo4 } = createMockRepository();
    const { result } = renderHook(() => useTodos(writer, todoList));

    act(() => result.current.clearTodo(todo3));
    expect(result.current.openTodos).toEqual([todo1]);
    expect(result.current.closedTodos).toEqual([todo2, todo4]);
  });

  test("clears all todos", () => {
    const { writer, todoList, todo1 } = createMockRepository();
    const { result } = renderHook(() => useTodos(writer, todoList));

    act(() => result.current.clearAllClosedTodos());
    expect(result.current.openTodos).toEqual([todo1]);
    expect(result.current.closedTodos).toEqual([]);
  });

  test("moves a todo", () => {
    const todo1 = Todo.create("test1", false);
    const todo2 = Todo.create("test2", false);
    const todo3 = Todo.create("test3", false);
    const todo4 = Todo.create("test4", false);
    const todoList = { id: "test", name: "foobar", todos: [todo1, todo2, todo3, todo4] };
    const { writer } = getMockRepository([todoList]);
    const { result } = renderHook(() => useTodos(writer, todoList));

    act(() => result.current.setDropTargetIndex(4));
    expect(result.current.dropTargetIndex).toBe(4);
    act(() => result.current.moveTodo(todo1));
    expect(result.current.openTodos).toEqual([todo2, todo3, todo4, todo1]);
  });
});
