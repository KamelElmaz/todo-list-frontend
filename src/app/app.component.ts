import { Component } from '@angular/core';
import { Todo, TodoService } from './todo.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>A list of TODOs</h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" [formControl]="searchControl">
      <app-progress-bar *ngIf="loading"></app-progress-bar>
      <app-todo-item
          *ngFor="let todo of filteredTodos$ | async"
          [item]="todo"
          (removeTodo)="handleRemove($event)">
      </app-todo-item>
    </div>
    <div class="notification" *ngIf="notification">
      {{ notification }}
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  todos: Todo[] = [];
  filteredTodos$: Observable<Todo[]>;
  loading: boolean = true;
  searchControl = new FormControl('');
  notification: string | null = null;

  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor(private todoService: TodoService) {
    // Fetch todos from the service
    this.todoService.getAll().subscribe({
      next: (data) => {
        this.todos = data;
        this.todosSubject.next(data); // Populate initial data
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Failed to load todos');
      }
    });

    // Filter todos based on search input
    this.filteredTodos$ = this.todosSubject.pipe(
        map((todos) => {
          const searchText = this.searchControl.value?.toLowerCase() || '';
          return searchText
              ? todos.filter((todo) =>
                  todo.task.toLowerCase().includes(searchText)
              )
              : todos;
        })
    );
  }

  handleRemove(todoId: number) {
    this.todoService.remove(todoId).subscribe({
      next: () => {
        this.todos = this.todos.filter((todo) => todo.id !== todoId);
        this.todosSubject.next(this.todos);
        this.showNotification('TODO removed successfully!');
      },
      error: () => {
        this.showNotification('Failed to remove TODO. Please try again.');
      }
    });
  }

  private showNotification(message: string) {
    this.notification = message;
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
}
