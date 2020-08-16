import React, { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import { LocalStorageTodoRepository, TodoRepository } from "../lib/repository";
import { loginWithGithub, logOut } from "../lib/firebase";
import LoginButton from "../components/LoginButton";
import { TodoListProvider } from "../components/todoListHook";

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

      <TodoListProvider repository={state.todoRepository}>
        <TodoList />
      </TodoListProvider>
    </div>
  );
}
