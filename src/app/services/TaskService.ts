import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, combineLatestWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
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

  private readonly STORAGE_KEY = 'my_app_tasks';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTasks = localStorage.getItem(this.STORAGE_KEY);
      if (storedTasks) {
        this.tasksSubject.next(JSON.parse(storedTasks));
      }
    }
  }

  private saveToStorage(tasks: Task[]) {
    this.tasksSubject.next(tasks);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(map((tasks) => tasks.filter((t) => t.status === status)));
  }

  updateTaskFilter(filter: string) {
    this.filterSubject.next(filter);
  }

  addTask(task: Omit<Task, 'id'>) {
    const currentTasks = this.tasksSubject.value;
    const maxId = currentTasks.length > 0 ? Math.max(...currentTasks.map((t) => t.id)) : 0;
    const newTask: Task = { ...task, id: maxId + 1 };

    this.saveToStorage([...currentTasks, newTask]);
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    this.saveToStorage(updatedTasks);
  }
}
