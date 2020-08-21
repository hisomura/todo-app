import { LocalStorageMock } from "../lib/localStorageMock";
import { getLocalStorageRepository } from "./localStorageRepository";
import { Todo, TodoList } from "../lib/todo";

describe("LocalStorageRepositoryWriter ", () => {
  beforeAll(() => {
    // noinspection JSConstantReassignment
    global.localStorage = new LocalStorageMock();
  });

  afterAll(() => {
    // @ts-ignore
    // noinspection JSConstantReassignment
    global.localStorage = {};
  });

  beforeEach(() => {
    global.localStorage.clear();
  });

  function getDataFromStorage(key: string) {
    const serialized = localStorage.getItem(key);
    if (serialized === null) throw new Error(`key '${key}' not found`);
    return JSON.parse(serialized);
  }

  test("saves a new todo list", () => {
    const { writer } = getLocalStorageRepository();
    const todoList = TodoList.create("TodoList1", [Todo.create("Todo1"), Todo.create("Todo2")]);

    writer.storeTodoList(todoList);
    expect(getDataFromStorage("todoLists")).toEqual([todoList]);
  });

  test("overwrites a existing todo list", () => {
    const { writer } = getLocalStorageRepository();
    const todoList = TodoList.create("TodoList1", [Todo.create("Todo1"), Todo.create("Todo2")]);
    writer.storeTodoList(todoList);

    const update = { ...todoList, name: "newTodoList1" };
    writer.storeTodoList(update);
    expect(getDataFromStorage("todoLists")).toEqual([update]);
  });

  test("updates a todo list", () => {
    // preparation
    const { writer } = getLocalStorageRepository();
    const todoList = TodoList.create("TodoList1", [Todo.create("Todo1"), Todo.create("Todo2")]);
    writer.storeTodoList(todoList);

    writer.updateTodoList(todoList.id, { name: "newName" });
    expect(getDataFromStorage("todoLists")[0].name).toBe("newName");
  });

  test("stores todos of a todo list", () => {
    const { writer } = getLocalStorageRepository();
    const todoList = TodoList.create("TodoList1", [Todo.create("Todo1"), Todo.create("Todo2")]);
    writer.storeTodoList(todoList);

    writer.storeTodos(todoList.id, [Todo.create("Todo3"), todoList.todos[1], todoList.todos[0]]);

    const [first] = getDataFromStorage("todoLists");
    expect(first.todos[0].name).toBe("Todo3");
    expect(first.todos[1].name).toBe("Todo2");
    expect(first.todos[2].name).toBe("Todo1");
  });
});

describe("LocalStorageRepositoryReader ", () => {
  beforeAll(() => {
    // noinspection JSConstantReassignment
    global.localStorage = new LocalStorageMock();
  });

  afterAll(() => {
    // @ts-ignore
    // noinspection JSConstantReassignment
    global.localStorage = {};
  });

  beforeEach(() => {
    global.localStorage.clear();
  });

  test("gets empty todo lists when 'todoLists' key doesn't exist", () => {
    const { reader } = getLocalStorageRepository();
    expect(reader.getTodoLists()).toEqual([]);
  });

  test("gets todo lists from storage", () => {
    const { writer, reader } = getLocalStorageRepository();
    const todoList = TodoList.create("TodoList1", [Todo.create("Todo1"), Todo.create("Todo2")]);
    writer.storeTodoList(todoList);
    expect(reader.getTodoLists()).toEqual([todoList]);
  });
});
