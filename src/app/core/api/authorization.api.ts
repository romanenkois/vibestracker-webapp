import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { $appConfig } from '@environments';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = $appConfig.api.BASE_API_URL;

  public codeLogIn(code: string): Observable<string> {
    return this.http.get<string>(
      `${this.baseUrl}/authorization/code?code=${code}`,
    );
  }
  public verifyToken(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/authorization/verify`);
  }
}
