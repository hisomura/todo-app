import todos, { addTodo, deleteTodo } from "./todosSlice";

describe("todosSlice", () => {
  test("addTodo adds a new todo.", () => {
    const nextTodos = todos([], {
      type: addTodo.type,
      payload: "foobar",
    });
    expect(nextTodos.length).toBe(1);
    expect(nextTodos[0].name).toBe("foobar");
    expect(nextTodos[0].closed).toBe(false);
  });

  test("deleteTodo deletes a todo.", () => {
    const prevTodos = [
      { listId: "list-id-1", id: "id-1", name: "foobar1", closed: false, order: 1 },
      { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 2 },
      { listId: "list-id-1", id: "id-3", name: "foobar3", closed: true, order: 3 },
    ];
    const nextTodos = todos(prevTodos, { type: deleteTodo.type, payload: { id: "id-2" } });

    expect(nextTodos.length).toBe(2);
  });
});
