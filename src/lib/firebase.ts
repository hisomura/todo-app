import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Todo } from "./todo";
import { TodoRepository } from "./repository";

const firebaseConfig = {
  apiKey: "AIzaSyCS5qI5XKgYS6exw1hwJpPKHfAMNtpECqw",
  authDomain: "todo-app-14449.firebaseapp.com",
  databaseURL: "https://todo-app-14449.firebaseio.com",
  projectId: "todo-app-14449",
  storageBucket: "todo-app-14449.appspot.com",
  messagingSenderId: "749222457537",
  appId: "1:749222457537:web:2f71ebf87d00a36b4a2440",
  measurementId: "G-1SPWXKTVPG",
};

function getApp() {
  if (firebase.apps.length > 0) {
    return firebase.app();
  }

  return firebase.initializeApp(firebaseConfig);
}

export async function logOut() {
  const app = getApp();
  if (!app.auth().currentUser) throw new Error("Already signed out.");

  const result = await app.auth().signOut();
  console.log("logout", result);
}

export async function loginWithGithub() {
  const app = getApp();
  if (app.auth().currentUser) throw new Error("Already signed in.");

  const provider = new firebase.auth.GithubAuthProvider();
  const userCredential = await app.auth().signInWithPopup(provider);
  console.log(userCredential);

  const repository = new DatabaseTodoRepository(app);
  await repository.init();

  return [userCredential.user!.uid, repository] as const;
}

export class DatabaseTodoRepository implements TodoRepository {
  protected todos: Todo[] = [];
  protected uploaded: boolean = true;
  protected intervalId: number | null = null;

  constructor(protected app: firebase.app.App) {}

  async init() {
    const userId = this.app.auth().currentUser!.uid;
    const snapshot = await firebase.database().ref(`users/${userId}/todos`).once("value");
    this.todos = convertDatabaseTodos(snapshot.val());

    this.intervalId = window.setInterval(async () => {
      if (this.uploaded) return;

      const databaseTodos = convertTodosForDatabase(this.todos);
      await firebase.database().ref(`users/${userId}/todos`).set(databaseTodos);
      this.uploaded = true;
      console.log("uploaded");
    }, 5000);
  }

  close() {
    window.clearInterval(this.intervalId!);
  }

  saveTodos(todos: Todo[]) {
    this.todos = todos;
    this.uploaded = false;
  }

  getTodos() {
    return this.todos;
  }

  getOpenTodos(): Todo[] {
    return this.todos.filter((t) => !t.closed);
  }

  getClosedTodos(): Todo[] {
    return this.todos.filter((t) => t.closed);
  }
}

export const firebaseTest = async () => {
  const app = getApp();
  const userId = app.auth().currentUser!.uid;
  firebase
    .database()
    .ref(`users/${userId}/todos`)
    .once("value")
    .then(function (snapshot) {
      console.log(snapshot);
      console.log(snapshot.val());
      console.log(snapshot.toJSON());
    });
};

type DatabaseTodo = Omit<Todo, "key"> & { order: number };
type DatabaseTodos = { [key: string]: DatabaseTodo };

export function convertTodosForDatabase(todos: Todo[]) {
  return todos.reduce<DatabaseTodos>((acc, { key, ...rest }, index) => {
    acc[key] = { ...rest, order: index + 1 };
    return acc;
  }, {});
}

export function convertDatabaseTodos(databaseTodos: DatabaseTodos) {
  return Object.keys(databaseTodos)
    .map((key) => ({
      ...databaseTodos[key],
      key,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...rest }) => rest);
}
