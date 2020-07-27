import React, { useEffect, useState } from 'react'
import Todo from '../components/Todo'
import { LocalStorageTaskRepository, TaskRepository } from '../lib/repository'

export default function Home() {
  const [repository, setRepository] = useState<TaskRepository | null>(null)

  useEffect(() => setRepository(LocalStorageTaskRepository.create()), [])
  if (!repository) {
    return <div>now loading...</div>
  }

  return <Todo repository={repository} />
}
