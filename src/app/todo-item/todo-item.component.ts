import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../todo.service';

@Component({
  selector: 'app-todo-item',
  template: `
    <div class="task-container" (click)="onClick()">
      <div class="task-indicator">
        {{ item.task }}
      </div>
      <div class="priority-indicator" [style.background-color]="color">
        {{ item.priority }}
      </div>
    </div>
  `,
  styleUrls: ['todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() item!: Todo;
  @Output() removeTodo = new EventEmitter<number>();

  get color() {
    switch (this.item.priority) {
      case 1: return 'green';
      case 2: return 'yellow';
      case 3: return 'red';
    }
  }

  onClick() {
    this.removeTodo.emit(this.item.id);
  }
}
