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
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';

    switch (status) {
      case TaskStatus.Completed:
        return `${baseClasses} bg-green-100 text-green-800`;
      case TaskStatus.InProgress:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  }
  filterOptions = ['All', 'Pending', 'In progress', 'Completed'];

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.taskService.updateFilter(selectElement.value);
  }
}
