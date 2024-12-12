import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Todo, TodoService } from './todo.service';
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
      <app-todo-item *ngFor="let todo of filteredTodos$ | async" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  todos: Todo[] = [];
  filteredTodos$: Observable<Todo[]>;
  loading: boolean = true;
  searchControl = new FormControl('');

  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor(todoService: TodoService) {
    // Fetch todos from the service
    todoService.getAll().subscribe({
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

    // React to search field changes
    this.searchControl.valueChanges
        .pipe(startWith('')) // Ensure the list is displayed initially
        .subscribe(() => this.todosSubject.next(this.todos));
  }
}
