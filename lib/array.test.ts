import { moveItem } from './array'

describe('moveItem()', () => {
  test('1', () => {
    const newItems = moveItem([0, 1, 2, 3, 4, 5], 2, 4)
    expect(newItems).toEqual([0, 1, 3, 2, 4, 5])
  })

  test('2', () => {
    const newItems2 = moveItem([0, 1, 2, 3, 4, 5], 0, 5)
    expect(newItems2).toEqual([1, 2, 3, 4, 0, 5])
  })

  test('2', () => {
    const newItems2 = moveItem([0, 1, 2, 3, 4, 5], 0, 6)
    expect(newItems2).toEqual([1, 2, 3, 4, 5, 0])
  })

  test('3', () => {
    const newItems = moveItem([0, 1, 2, 3, 4, 5], 5, 2)
    expect(newItems).toEqual([0, 1, 5, 2, 3, 4])
  })
})
