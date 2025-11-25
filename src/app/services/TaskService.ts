import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, combineLatestWith } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private initialTaskList: Task[] = [
    {
      id: 1,
      title: 'fix errors in login screen',
      description: 'fix errors in login screen',
      status: TaskStatus.Pending,
    },
    {
      id: 2,
      title: 'create new screen for add products',
      description: 'create new screen for add products',
      status: TaskStatus.Pending,
    },
    {
      id: 3,
      title: 'handle api requests',
      description: 'handle api requests',
      status: TaskStatus.Completed,
    },
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.initialTaskList);
  private filterSubject = new BehaviorSubject<string>('All');

  tasks$: Observable<Task[]> = this.tasksSubject.pipe(
    combineLatestWith(this.filterSubject),

    map(([tasks, filter]) => {
      if (filter === 'All') {
        return tasks;
      }
      return tasks.filter((task) => task.status === filter);
    })
  );

  totalTasksCount$ = this.tasks$.pipe(
    map((tasks) => tasks.length),
    distinctUntilChanged()
  );

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(map((tasks) => tasks.filter((t) => t.status === status)));
  }

  constructor() {}
  updateFilter(filter: string) {
    this.filterSubject.next(filter);
  }
  addTask(task: Omit<Task, 'id'>) {
    const currentTasks = this.tasksSubject.value;
    const maxId = currentTasks.length > 0 ? Math.max(...currentTasks.map((t) => t.id)) : 0;
    const newTask: Task = { ...task, id: maxId + 1 };

    this.tasksSubject.next([...currentTasks, newTask]);
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    this.tasksSubject.next(updatedTasks);
  }
}
