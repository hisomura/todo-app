export const moved = <T>(items: T[], itemIndex: number, targetIndex: number) => {
  const item = items[itemIndex];
  if (
    itemIndex === targetIndex ||
    item === undefined ||
    !Number.isInteger(targetIndex) ||
    targetIndex < 0 ||
    items.length < targetIndex
  )
    return [...items];

  const newItems = [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)];
  if (itemIndex < targetIndex) {
    newItems.splice(targetIndex - 1, 0, item);
  } else {
    newItems.splice(targetIndex, 0, item);
  }

  return newItems;
};
