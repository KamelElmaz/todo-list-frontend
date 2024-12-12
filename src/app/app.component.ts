import { Component } from '@angular/core';
import { Todo, TodoService } from "./todo.service";

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text">
      <app-progress-bar *ngIf="loading"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  todos: Todo[] = [];
  loading: boolean = true;

  constructor(todoService: TodoService) {
    todoService.getAll().subscribe({
      next: (data) => {
        this.todos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Failed to load todos');
      }
    });
  }
}
