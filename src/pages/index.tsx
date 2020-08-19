import React, { useEffect, useState } from "react";
import TodoListContainer from "../components/TodoListContainer";
import LoginButton from "../components/buttons/LoginButton";
import { getMockRepository } from "../repositories/mockRepository";
import { RepositoryWriterProvider } from "../repositories/ReposiotryProvider";
import NewTodoList from "../components/NewTodoList";
import { RepositoryReader, RepositoryWriter } from "../repositories/repository";

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
    const repository = getMockRepository([{ id: "test", name: "TodoList!", todos: [] }]);
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
    <div>
      <div className="max-w-xl mx-auto pt-8 z-0 flex justify-end">
        {state.userId ? (
          <LoginButton onclick={logout} message="Logout" />
        ) : (
          <LoginButton onclick={login} message="Login with Github" />
        )}
      </div>
      <div className="flex">
        <RepositoryWriterProvider writer={state.repository.writer}>
          {state.repository.reader.getTodoLists().map((list) => {
            return <TodoListContainer key={list.id} list={list} />;
          })}
          <NewTodoList />
        </RepositoryWriterProvider>
      </div>
    </div>
  );
}
