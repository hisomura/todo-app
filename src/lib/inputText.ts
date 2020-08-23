import { KeyboardEventHandler } from "react";

export function createInputTextOnKeyDownCallback(callback: (input: string) => void) {
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== "Enter") return;
    if (event.currentTarget.value === "") return;
    callback(event.currentTarget.value);
    event.currentTarget.value = "";
  };

  return onKeyDown;
}
