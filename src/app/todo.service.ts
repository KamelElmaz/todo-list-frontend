import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = 'http://localhost:8099/api/todos';

  constructor(private http: HttpClient) {}

  // Fetch all TODOs
  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  // Remove a TODO by its ID
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
