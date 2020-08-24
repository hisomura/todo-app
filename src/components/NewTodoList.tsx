import React, { useEffect, useRef, useState } from "react";
import { createInputTextOnKeyDownCallback } from "../lib/inputText";

type Props = {
  addNewTodoList: (name: string) => void;
};

export default function NewTodoList(props: Props) {
  const [inputMode, setInputMode] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);

  const onKeyDown = createInputTextOnKeyDownCallback((input) => props.addNewTodoList(input));

  useEffect(() => {
    if (inputMode && inputEl.current) {
      inputEl.current.focus();
    }
  }, [inputMode]);

  return (
    <div className="mx-6 pt-2 z-0">
      <div className="w-64 shadow-xl rounded px-4 pb-4">
        <div className="pt-4">
          {inputMode ? (
            <input
              type="text"
              id="new-todo-list"
              className="focus:outline-none ml-1 w-10/12"
              ref={inputEl}
              onKeyDown={onKeyDown}
              onBlur={() => setInputMode(false)}
            />
          ) : (
            <h1 className="cursor-pointer " data-testid="add-new-todo-list" onClick={() => setInputMode(true)}>
              + New Todo List
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
