import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:5000/api/users'
  }

  register(user: Object) {
    return this.http.post(`${this.ROOT_URL}/register`, user)
  }

}
