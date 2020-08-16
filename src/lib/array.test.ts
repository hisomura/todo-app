import { moved } from "./array";

describe("moved()", () => {
  const testArray = [0, 1, 2, 3, 4, 5];

  test.each([
    [0, 0, [0, 1, 2, 3, 4, 5]],
    [0, 1, [0, 1, 2, 3, 4, 5]],
    [0, 2, [1, 0, 2, 3, 4, 5]],
    [0, 5, [1, 2, 3, 4, 0, 5]],
    [0, 6, [1, 2, 3, 4, 5, 0]],

    [5, 0, [5, 0, 1, 2, 3, 4]],
    [5, 1, [0, 5, 1, 2, 3, 4]],

    [10, 2, testArray],
    [-10, 2, testArray],
    [2, 10, testArray],
    [2, -10, testArray],
    [3, 3, testArray],
  ])("moved(%i, %i)", (a, b, expected) => {
    expect(moved(testArray, a, b)).toEqual(expected);
  });
});
