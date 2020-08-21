import { LocalStorageMock } from "./localStorageMock";

describe("LocalStorageMock ", () => {
  test("sets and gets value", () => {
    const localStorage = new LocalStorageMock();
    localStorage.setItem("foo", "bar");
    localStorage.setItem("hello", "world");

    expect(localStorage.length).toBe(2);
    expect(localStorage.getItem("foo")).toBe("bar");
    expect(localStorage.getItem("hello")).toBe("world");
  });

  test("deletes item", () => {
    const localStorage = new LocalStorageMock();
    localStorage.setItem("foo", "bar");
    localStorage.setItem("hello", "world");
    localStorage.removeItem("foo");
    expect(localStorage.length).toBe(1);
  });

  test("clears items", () => {
    const localStorage = new LocalStorageMock();
    localStorage.setItem("foo", "bar");
    localStorage.setItem("hello", "world");
    localStorage.clear();
    expect(localStorage.length).toBe(0);
  });
});
