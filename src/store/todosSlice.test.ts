import todos, { addTodo, closeTodos, deleteTodos, moveTodos, openTodos, Todo } from "./todosSlice";

describe("todosSlice", () => {
  const prevTodos: Todo[] = [
    { listId: "list-id-1", id: "id-1", name: "foobar1", closed: false, order: 1 },
    { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 2 },
    { listId: "list-id-1", id: "id-3", name: "foobar3", closed: true, order: 3 },
    { listId: "list-id-1", id: "id-4", name: "foobar4", closed: true, order: 4 },
  ];

  test("addTodo adds a new todo.", () => {
    const nextTodos = todos(prevTodos, {
      type: addTodo.type,
      payload: { name: "foobar", listId: "list-id-1" },
    });
    expect(nextTodos.length).toBe(5);
    expect(nextTodos[4].listId).toBe("list-id-1");
    expect(nextTodos[4].name).toBe("foobar");
    expect(nextTodos[4].closed).toBe(false);
    expect(nextTodos[4].order).toBe(5);
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
    expect(nextTodos.filter((t) => t.closed).length).toBe(4);
  });

  test("openTodos opens todos.", () => {
    const nextTodos = todos(prevTodos, { type: openTodos.type, payload: { ids: ["id-3"] } });
    expect(nextTodos.filter((t) => !t.closed).length).toBe(3);
    expect(nextTodos[2]).toEqual({ listId: "list-id-1", id: "id-3", name: "foobar3", closed: false, order: 3 });
  });
});

describe("todosSlice.moveTodos", () => {
  const prevTodos: Todo[] = [
    { listId: "list-id-1", id: "id-1", name: "foobar1", closed: false, order: 1 },
    { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 2 },
    { listId: "list-id-1", id: "id-3", name: "foobar3", closed: true, order: 3 },
    { listId: "list-id-1", id: "id-4", name: "foobar4", closed: true, order: 4 },
  ];
  test("moves todos to another Todos", () => {
    const nextTodos = todos(prevTodos, {
      type: moveTodos.type,
      payload: { targetIds: ["id-1", "id-3"], fromListId: "list-id-1", toListId: "new-list-id1", index: 0 },
    });
    expect(nextTodos).toEqual([
      { listId: "new-list-id1", id: "id-1", name: "foobar1", closed: false, order: 1 },
      { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 1 },
      { listId: "new-list-id1", id: "id-3", name: "foobar3", closed: true, order: 2 },
      { listId: "list-id-1", id: "id-4", name: "foobar4", closed: true, order: 2 },
    ]);
  });
  test("moves todos to last of the same list.", () => {
    const nextTodos = todos(prevTodos, {
      type: moveTodos.type,
      payload: { targetIds: ["id-1", "id-3"], fromListId: "list-id-1", toListId: "list-id-1", index: 2 },
    });
    expect(nextTodos).toEqual([
      { listId: "list-id-1", id: "id-1", name: "foobar1", closed: false, order: 3 },
      { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 1 },
      { listId: "list-id-1", id: "id-3", name: "foobar3", closed: true, order: 4 },
      { listId: "list-id-1", id: "id-4", name: "foobar4", closed: true, order: 2 },
    ]);
  });

  test("moves todos to first of the same list.", () => {
    const nextTodos = todos(prevTodos, {
      type: moveTodos.type,
      payload: { targetIds: ["id-3", "id-4"], fromListId: "list-id-1", toListId: "list-id-1", index: 0 },
    });
    expect(nextTodos).toEqual([
      { listId: "list-id-1", id: "id-1", name: "foobar1", closed: false, order: 3 },
      { listId: "list-id-1", id: "id-2", name: "foobar2", closed: false, order: 4 },
      { listId: "list-id-1", id: "id-3", name: "foobar3", closed: true, order: 1 },
      { listId: "list-id-1", id: "id-4", name: "foobar4", closed: true, order: 2 },
    ]);
  });
});
