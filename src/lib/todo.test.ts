import { moveTodoToAnotherList, Todo, TodoList } from "./todo";

describe("moveTodoToAnotherList()", () => {
  test("moves a todo to another todo list.", () => {
    const list1 = TodoList.create("list1", [Todo.create("todo1-1")]);
    const list2 = TodoList.create("list2", [Todo.create("todo2-1")]);

    const result = moveTodoToAnotherList(list1.todos[0], [list1, list2], list1, list2);
    expect(result).toEqual<TodoList[]>([
      { ...list1, todos: [] },
      { ...list2, todos: [list2.todos[0], list1.todos[0]] },
    ]);
  });
});