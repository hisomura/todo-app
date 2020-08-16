import { act, renderHook } from "@testing-library/react-hooks";
import { useTodoList } from "./todoListHook";
import { MockTodoRepository } from "../lib/repository";
import { Todo } from "../lib/todo";


describe("todoListHook", () => {
  test("adds a todo.", () => {
    const repository = new MockTodoRepository();
    repository.saveTodos([]);
    const { result } = renderHook(() => useTodoList(repository));
    expect(result.current.openTodos).toEqual([]);

    const todo = Todo.create("test");
    act(() => result.current.addTodo(todo));
    expect(result.current.openTodos).toEqual([todo]);
    expect(result.current.closedTodos).toEqual([]);
  });

  test("close a todo.", () => {
    const repository = new MockTodoRepository();
    const todo = Todo.create("test");
    repository.saveTodos([todo]);
    const { result } = renderHook(() => useTodoList(repository));

    act(() => result.current.closeTodo(todo));
    expect(result.current.openTodos).toEqual([]);
    expect(result.current.closedTodos).toEqual([todo]);
  });

  test("reopen a todo.", () => {
    const repository = new MockTodoRepository();
    const todo = Todo.create("test", true);
    repository.saveTodos([todo]);
    const { result } = renderHook(() => useTodoList(repository));

    act(() => result.current.reopenTodo(todo));
    expect(result.current.openTodos).toEqual([todo]);
    expect(result.current.closedTodos).toEqual([]);
  });

  function createMockTodoRepository() {
    const repository = new MockTodoRepository();
    const todo1 = Todo.create("test1", false);
    const todo2 = Todo.create("test2", true);
    const todo3 = Todo.create("test3", true);
    const todo4 = Todo.create("test4", true);
    repository.saveTodos([todo1, todo2, todo3, todo4]);

    return { repository, todo1, todo2, todo3, todo4 };
  }

  test("clear a todo.", () => {
    const { repository, todo1, todo2, todo3, todo4 } = createMockTodoRepository();
    const { result } = renderHook(() => useTodoList(repository));

    act(() => result.current.clearTodo(todo3));
    expect(result.current.openTodos).toEqual([todo1]);
    expect(result.current.closedTodos).toEqual([todo2, todo4]);
  });

  test("clear all todos.", () => {
    const { repository, todo1 } = createMockTodoRepository();
    const { result } = renderHook(() => useTodoList(repository));

    act(() => result.current.clearAllClosedTodos());
    expect(result.current.openTodos).toEqual([todo1]);
    expect(result.current.closedTodos).toEqual([]);
  });

  test("move a todo.", () => {
    const repository = new MockTodoRepository();
    const todo1 = Todo.create("test1", false);
    const todo2 = Todo.create("test2", false);
    const todo3 = Todo.create("test3", false);
    const todo4 = Todo.create("test4", false);
    repository.saveTodos([todo1, todo2, todo3, todo4]);
    const { result } = renderHook(() => useTodoList(repository));

    act(() => result.current.setDropTargetIndex(4));
    expect(result.current.dropTargetIndex).toBe(4);
    act(() => result.current.moveTodo(todo1));
    expect(result.current.openTodos).toEqual([todo2, todo3, todo4, todo1]);
  });
});
