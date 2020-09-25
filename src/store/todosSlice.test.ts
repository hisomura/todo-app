import todos, { addTodo, deleteTodos, closeTodos, openTodos } from "./todosSlice";

describe("todosSlice", () => {
  const prevTodos = [
    { listId: "list-id-1", id: "id-1", name: "foobar1", closed: false, order: 1 },
    { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 2 },
    { listId: "list-id-1", id: "id-3", name: "foobar3", closed: true, order: 3 },
    { listId: "list-id-1", id: "id-4", name: "foobar4", closed: true, order: 4 },
  ]

  test("addTodo adds a new todo.", () => {
    const nextTodos = todos([], {
      type: addTodo.type,
      payload: "foobar",
    });
    expect(nextTodos.length).toBe(1);
    expect(nextTodos[0].name).toBe("foobar");
    expect(nextTodos[0].closed).toBe(false);
  });

  test("deleteTodos deletes a todo.", () => {
    const nextTodos = todos(prevTodos, { type: deleteTodos.type, payload: { ids: ["id-2"] } });
    expect(nextTodos.length).toBe(3);
  });

  test("deleteTodos deletes todos.", () => {
    const nextTodos = todos(prevTodos, { type: deleteTodos.type, payload: { ids: ["id-1", "id-2", "id-3"] } });
    expect(nextTodos.length).toBe(1);
  });

  test("closeTodos closes todos.", () => {
    const nextTodos = todos(prevTodos, { type: closeTodos.type, payload: { ids: ["id-1", "id-2"] } });
    expect(nextTodos.filter(t => t.closed).length).toBe(4);
  });

  test("openTodos opens todos.", () => {
    const nextTodos = todos(prevTodos, { type: openTodos.type, payload: { ids: ["id-3", "id-4"] } });
    expect(nextTodos.filter(t => !t.closed).length).toBe(4);
  });
});
