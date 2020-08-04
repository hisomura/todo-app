import React, { useEffect, useState } from 'react'
import Todo from '../components/Todo'
import { LocalStorageTaskRepository, TaskRepository } from '../lib/repository'
import {loginWithGithub, logOut} from '../lib/firebase'

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

  const toggleLogin = async () => {
    if (state.userId) {
      return await logOut()
    }
    const [userId, repository] = await loginWithGithub()
    updateState({ userId, taskRepository: repository })
  }

  return (
    <div>
      <div>
        <button type="button" onClick={toggleLogin}>
          {state.userId ? 'Sign out' : 'Sign in with Github'}
        </button>
        {state.userId ? (
          <div>User: {state.userId}</div>
        ) : null}
      </div>

      <Todo repository={state.taskRepository} />
    </div>
  )
}
