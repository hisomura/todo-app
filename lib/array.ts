export const moveItem = <T>(items: T[], itemIndex: number, targetIndex: number) => {
  const item = items[itemIndex]
  const newItems = [...items]
  newItems.splice(itemIndex, 1)
  if (itemIndex < targetIndex) {
    newItems.splice(targetIndex - 1, 0, item)
  } else {
    newItems.splice(targetIndex, 0, item)
  }

  return newItems
}
