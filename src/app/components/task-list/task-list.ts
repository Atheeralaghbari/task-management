import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TaskService } from '../../services/TaskService';
import { Task, TaskStatus } from '../../models/task';
import { Observable } from 'rxjs';
import { AddTask } from '../add-task/add-task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, AddTask],
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {
  tasks$!: Observable<Task[]>;
  isModalOpen = false;
  totalTasksCount$!: Observable<number>;
  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.tasks$ = this.taskService.tasks$;
    this.totalTasksCount$ = this.taskService.totalTasksCount$;
  }

  markInProgress(id: number) {
    this.taskService.updateTaskStatus(id, TaskStatus.InProgress);
  }

  markCompleted(id: number) {
    this.taskService.updateTaskStatus(id, TaskStatus.Completed);
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  getStatusClasses(status: TaskStatus): string {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full border';

    switch (status) {
      case TaskStatus.Completed:
        return `${baseClasses} text-emerald-600 bg-emerald-50   border-emerald-200`;
      case TaskStatus.InProgress:
        return `${baseClasses} bg-red-50 text-red-400 border-red-200`;
      default: // Pending
        return `${baseClasses} bg-indigo-100 text-indigo-500 border-indigo-200`;
    }
  }
  filterOptions = ['All', 'Pending', 'In progress', 'Completed'];

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.taskService.updateFilter(selectElement.value);
  }
}
