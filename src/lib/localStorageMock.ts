export class LocalStorageMock implements Storage {
  protected list: { key: string; value: string }[] = [];

  get length() {
    return this.list.length;
  }

  clear() {
    this.list = [];
  }

  key(index: number) {
    if (this.list[index]) return this.list[index].key;
    return null;
  }

  getItem(key: string) {
    const item = this.list.find((i) => i.key === key);
    if (item === undefined) return null;
    return item.value;
  }

  setItem(key: string, value: string) {
    const index = this.list.findIndex((i) => i.key === key);
    if (index === -1) {
      this.list.push({ key, value });
    } else {
      this.list[index] = { key, value };
    }
  }

  removeItem(key: string) {
    const index = this.list.findIndex((i) => i.key === key);
    if (index !== -1) this.list.splice(index, 1);
  }
}
