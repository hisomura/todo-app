import React, { useEffect, useState } from "react";
import LoginButton from "../components/buttons/LoginButton";
import { getMockRepository } from "../repositories/mockRepository";
import { RepositoryWriterProvider } from "../repositories/ReposiotryProvider";
import { RepositoryReader, RepositoryWriter } from "../repositories/repository";
import BoardContainer from "../components/BoardContainer";
import { getLocalStorageRepository } from "../repositories/localStorageRepository";
import { ModalProvider } from "../components/common/Modal";

type ApplicationState = {
  userId: string | null;
  repository: {
    reader: RepositoryReader;
    writer: RepositoryWriter;
  } | null;
};

function useApplicationState() {
  const [state, setState] = useState<ApplicationState>({
    userId: null,
    repository: null,
  });

  const updateState = (params: Partial<ApplicationState>) => {
    setState((prev) => ({ ...prev, ...params }));
  };

  return [state, updateState] as const;
}

export default function Home() {
  const [state, updateState] = useApplicationState();

  useEffect(() => {
    const repository = getLocalStorageRepository();
    updateState({ repository });
  }, []);

  if (!state.repository) {
    return <div>now loading...</div>;
  }

  const login = async () => {
    const repository = getMockRepository([{ id: "test", name: "TodoList!", todos: [] }]);
    // FIXME
    // const [userId, repository] = await loginWithGithub();
    // if (state.todoRepository) {
    //   const todos = state.todoRepository.getTodos();
    //   repository.saveTodos([...repository.getTodos(), ...todos]);
    //   state.todoRepository.saveTodos([]);
    // }
    console.log(repository.reader.getTodoLists());
    updateState({ userId: "test", repository });
  };

  const logout = async () => {
    // FIXME
    // state.todoRepository?.close();
    // const repository = new LocalStorageTodoRepository();
    // repository.init();
    // updateState({ userId: null, todoRepository: repository });
    // await logOut();
  };

  return (
    <ModalProvider>
      <div className="max-w-xl mx-auto pt-8 z-0 flex justify-end">
        {state.userId ? (
          <LoginButton onclick={logout} message="Logout" />
        ) : (
          <LoginButton onclick={login} message="Login with Github" />
        )}
      </div>
      <RepositoryWriterProvider writer={state.repository.writer}>
        <BoardContainer todoLists={state.repository.reader.getTodoLists()} />
      </RepositoryWriterProvider>
    </ModalProvider>
  );
}
