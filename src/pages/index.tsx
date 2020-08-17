import React, { useEffect, useState } from "react";
import TodoListContainer from "../components/TodoListContainer";
import { LocalStorageTodoRepository, TodoRepository } from "../lib/repository";
import { loginWithGithub, logOut } from "../lib/firebase";
import LoginButton from "../components/LoginButton";
import { TodoListProvider } from "../lib/todoListHook";

type ApplicationState = {
  userId: string | null;
  todoRepository: TodoRepository | null;
};

function useApplicationState() {
  const [state, setState] = useState<ApplicationState>({
    userId: null,
    todoRepository: null,
  });

  const updateState = (params: Partial<ApplicationState>) => {
    setState((prev) => ({ ...prev, ...params }));
  };

  return [state, updateState] as const;
}

export default function Home() {
  const [state, updateState] = useApplicationState();

  useEffect(() => {
    updateState({ todoRepository: LocalStorageTodoRepository.create() });
  }, []);

  if (!state.todoRepository) {
    return <div>now loading...</div>;
  }

  const login = async () => {
    const [userId, repository] = await loginWithGithub();
    if (state.todoRepository) {
      const todos = state.todoRepository.getTodos();
      repository.saveTodos([...repository.getTodos(), ...todos]);
      state.todoRepository.saveTodos([]);
    }
    updateState({ userId, todoRepository: repository });
  };

  const logout = async () => {
    state.todoRepository?.close();
    const repository = new LocalStorageTodoRepository();
    repository.init();
    updateState({ userId: null, todoRepository: repository });
    await logOut();
  };

  return (
    <div>
      <div className="max-w-xl mx-auto pt-8 z-0 flex justify-end">
        {state.userId ? (
          <LoginButton onclick={logout} message="Logout" />
        ) : (
          <LoginButton onclick={login} message="Login with Github" />
        )}
      </div>
      <div className="flex">
        <TodoListProvider repository={state.todoRepository}>
          {state.todoRepository.getTodoLists().map((list) => {
            return <TodoListContainer key={list.id} list={list} />;
          })}
          <div className="mx-6 pt-2 z-0">
            <div className="w-96 shadow-xl rounded px-4 pb-4">
              <div className="pt-4">
                <h1 className="cursor-pointer ">+ New Todo List</h1>
              </div>
            </div>
          </div>
        </TodoListProvider>
      </div>
    </div>
  );
}
