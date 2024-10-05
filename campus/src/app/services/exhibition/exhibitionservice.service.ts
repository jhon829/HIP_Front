import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  private apiUrl = 'http://localhost:3000'; // 실제 API URL로 변경하세요.

  constructor(private http: HttpClient) {}

  // Create: 전시물 생성하기 (생성페이지)
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


  // Read: 전시물 목록 가져오기 (메인페이지) - 프로젝트이름, 팀이름, 기수, 썸네일
  getExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/register`);
  }



  // Read: 특정 전시물 가져오기 (상세페이지) - 전체 내용
  getExhibitionDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exhibitions/${id}/details`);
  }

  // Update: 전시물 수정
  updateExhibition(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/exhibitions/${id}`, formData);
  }

  // Delete: 전시물 삭제
  deleteExhibition(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/exhibitions/${id}`);
  }
}

export class ExhibitionserviceService {
}
