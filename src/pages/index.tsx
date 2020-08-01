import React, { useEffect, useState } from 'react'
import Todo from '../components/Todo'
import { LocalStorageTaskRepository, TaskRepository } from '../lib/repository'

type ApplicationState = {
  userId: string | null
  taskRepository: TaskRepository | null
}

function useApplicationState() {
  const [state, setState] = useState<ApplicationState>({
    userId: null,
    taskRepository: null,
  })

  const updateState = (params: Partial<ApplicationState>) => {
    setState((prev) => ({ ...prev, ...params }))
  }

  return [state, updateState] as const
}

export default function Home() {
  const [state, updateState] = useApplicationState()

  useEffect(() => {
    updateState({ taskRepository: LocalStorageTaskRepository.create() })
  }, [])

  if (!state.taskRepository) {
    return <div>now loading...</div>
  }

  const login = () => {
    updateState({ userId: 'user-id-1' })
  }

  return (
    <div>
      {state.userId ? (
        <div>User: {state.userId}</div>
      ) : (
        <button type="button" onClick={login}>
          Sign in with Google
        </button>
      )}
      <Todo repository={state.taskRepository} />
    </div>
  )
}
