import todos, {addTodo, Todo} from "./todosSlice";

describe("todosSlice", () => {
  test("moves a todo to another todo list.", () => {
    const nextTodos = todos([], {
      type: addTodo.type,
      payload: 'foobar'
    })
    expect(nextTodos.length).toBe(1)
    expect(nextTodos[0].name).toBe('foobar')
    expect(nextTodos[0].closed).toBe(false)
  });
});
