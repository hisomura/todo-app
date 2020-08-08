import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Todo } from './todo'
import { TodoRepository } from './repository'

const firebaseConfig = {
  apiKey: 'AIzaSyCS5qI5XKgYS6exw1hwJpPKHfAMNtpECqw',
  authDomain: 'todo-app-14449.firebaseapp.com',
  databaseURL: 'https://todo-app-14449.firebaseio.com',
  projectId: 'todo-app-14449',
  storageBucket: 'todo-app-14449.appspot.com',
  messagingSenderId: '749222457537',
  appId: '1:749222457537:web:2f71ebf87d00a36b4a2440',
  measurementId: 'G-1SPWXKTVPG',
}

function getApp() {
  if (firebase.apps.length > 0) {
    return firebase.app()
  }

  return firebase.initializeApp(firebaseConfig)
}

export async function logOut() {
  const app = getApp()
  if (!app.auth().currentUser) throw new Error('Already signed out.')

  const result = await app.auth().signOut()
  console.log('logout', result)
}

export async function loginWithGithub() {
  const app = getApp()
  if (app.auth().currentUser) throw new Error('Already signed in.')

  const provider = new firebase.auth.GithubAuthProvider()
  const userCredential = await app.auth().signInWithPopup(provider)
  console.log(userCredential)

  const repository = new FirestoreTodoRepository(app)
  repository.load()

  return [userCredential.user!.uid, repository] as const
}

export class FirestoreTodoRepository implements TodoRepository {
  public todos: Todo[] = []

  constructor(protected app: firebase.app.App) {}

  saveTodos(todos: Todo[]) {
    this.todos = todos
  }

  getTodos() {
    return this.todos
  }

  load() {}
}