import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
// import { AddTask } from './components/add-task/add-task';
export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },

  { path: 'tasks', component: TaskList, title: 'Task List' },
  // { path: 'add', component: AddTask },
];
