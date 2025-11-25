import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/TaskService';
import { TaskStatus } from '../../models/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.html',
  standalone: true,
})
export class AddTask {
  @Output() close = new EventEmitter<void>();

  taskForm: FormGroup;
  statusOptions = Object.values(TaskStatus);

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.Pending],
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value);
      this.close.emit();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.close.emit();
  }
}
