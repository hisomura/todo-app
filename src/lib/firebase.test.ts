import { Todo } from "./todo";
import { convertDatabaseTodos, convertTodosForDatabase } from "./firebase";

describe("convertTodosForDatabase", () => {
  test("converts Todos to DatabaseTodos", () => {
    const todos: Todo[] = [
      { key: "key1", name: "hello", closed: false },
      { key: "key2", name: "hello, world", closed: true },
      { key: "key3", name: "Hi", closed: false },
    ];

    const databaseTodos = convertTodosForDatabase(todos);

    expect(databaseTodos).toEqual({
      key1: { name: "hello", closed: false, order: 1 },
      key2: { name: "hello, world", closed: true, order: 2 },
      key3: { name: "Hi", closed: false, order: 3 },
    });
  });

  test("converts [] to {}", () => {
    const databaseTodos = convertTodosForDatabase([]);
    expect(databaseTodos).toEqual({});
  });
});

describe("convertDatabaseTodosToTodos", () => {
  test("converts DatabaseTodos to Todos", () => {
    const databaseTodos = {
      key1: { name: "hello", closed: false, order: 2 },
      key2: { name: "hello, world", closed: true, order: 3 },
      key3: { name: "Hi", closed: false, order: 1 },
    };

    const todos = convertDatabaseTodos(databaseTodos);
    expect(todos).toEqual([
      { key: "key3", name: "Hi", closed: false },
      { key: "key1", name: "hello", closed: false },
      { key: "key2", name: "hello, world", closed: true },
    ]);
  });

  test("converts {} to []", () => {
    const firebaseTodos = convertDatabaseTodos({});
    expect(firebaseTodos).toEqual([]);
  });
});
