import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  private apiUrl = 'http://localhost:3000'; // 실제 API URL로 변경하세요.

  constructor(private http: HttpClient) {}

  saveExhibitionData(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/exhibitions/register`, data);
  }

  saveIntroductions(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/exhibition-intro/register`, data);
  }

  saveMembers(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/exhibition-docs/register`, data);
  }

  saveOutputs(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/exhibition-members/register`, data);
  }

  // 참고
  // saveExhibitionData(formData: FormData): Observable<any> {
  //   const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
  //   const url = this.apiUrl + '/register'
  //   console.log(url);
  //   return this.http.post(url, formData, { headers, withCredentials: true });
  // }

  // Read: 전시물 목록 가져오기
  getExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Read: 특정 전시물 가져오기
  getExhibition(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update: 전시물 수정
  updateExhibition(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  // Delete: 전시물 삭제
  deleteExhibition(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

export class ExhibitionserviceService {
}
