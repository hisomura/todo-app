import React, { useEffect, useState } from 'react'
import TodoList from '../components/TodoList'
import { LocalStorageTodoRepository, TodoRepository } from '../lib/repository'
import { DatabaseTodoRepository, loginWithGithub, logOut } from '../lib/firebase'

type ApplicationState = {
  userId: string | null
  todoRepository: TodoRepository | null
}

function useApplicationState() {
  const [state, setState] = useState<ApplicationState>({
    userId: null,
    todoRepository: null,
  })

  const updateState = (params: Partial<ApplicationState>) => {
    setState((prev) => ({ ...prev, ...params }))
  }

  return [state, updateState] as const
}

export default function Home() {
  const [state, updateState] = useApplicationState()

  useEffect(() => {
    updateState({ todoRepository: LocalStorageTodoRepository.create() })
  }, [])

  if (!state.todoRepository) {
    return <div>now loading...</div>
  }

  const toggleLogin = async () => {
    if (state.userId) {
      //FIXME
      if (state.todoRepository && 'close' in state.todoRepository) {
        ;(state.todoRepository as DatabaseTodoRepository).close()
      }
      updateState({ userId: null, todoRepository: new LocalStorageTodoRepository() })
      await logOut()
    } else {
      const [userId, repository] = await loginWithGithub()
      //FIXME
      if (state.todoRepository) {
        const todos = state.todoRepository.getTodos()
        repository.saveTodos([...repository.getTodos(), ...todos])
        state.todoRepository.saveTodos([])
      }
      updateState({ userId, todoRepository: repository })
    }
  }

  return (
    <div>
      <div>
        <button type="button" onClick={toggleLogin}>
          {state.userId ? 'Sign out' : 'Sign in with Github'}
        </button>
        {state.userId ? <div>User: {state.userId}</div> : null}
      </div>

      <TodoList repository={state.todoRepository} />
    </div>
  )
}
