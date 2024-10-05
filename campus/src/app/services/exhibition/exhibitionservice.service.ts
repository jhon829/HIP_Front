import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
    return this.http.post(`${this.apiUrl}/exhibition-members/register`, data);
  }

  saveOutputs(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/exhibition-docs/register`, data);
  }


  // Read: 전시물 목록 가져오기 (메인페이지) - 프로젝트이름, 팀이름, 기수, 썸네일
  getExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/register`);
  }



  // Read: 특정 전시물 가져오기 (상세페이지) - 전체 내용

  // 데이터를 병렬로 효율적으로 가져오기 위함 + 데이터의 구조를 편리한 형태로 바꿈
  getAllExhibitionDetails(id: number): Observable<any> {
    return forkJoin({
      exhibition: this.getExhibitionDetails(id),
      intro: this.getExhibitionIntroDetails(id),
      docs: this.getExhibitionDocsDetails(id),
      members: this.getExhibitionMembersDetails(id)
    }).pipe(
      map(results => ({
        ...results.exhibition,
        intro: results.intro,
        docs: results.docs,
        members: results.members
      }))
    );
  }
  private getExhibitionDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exhibitions/${id}`);
  }

  private getExhibitionIntroDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exhibition-intro/${id}`);
  }

  private getExhibitionDocsDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exhibition-docs/${id}`);
  }

  private getExhibitionMembersDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/exhibition-members/${id}`);
  }

  // Update: 전시물 수정(파일을 삭제하고 올릴 수 있게)
  updateExhibition(id: string, exhibitionData: FormData, introData: FormData, membersData: FormData, outputsData: FormData): Observable<any> {
    return forkJoin({
      exhibition: this.http.put(`${this.apiUrl}/exhibitions/${id}`, exhibitionData),
      intro: this.http.put(`${this.apiUrl}/exhibition-intro/${id}`, introData),
      members: this.http.put(`${this.apiUrl}/exhibition-members/${id}`, membersData),
      outputs: this.http.put(`${this.apiUrl}/exhibition-docs/${id}`, outputsData)
    });
  }

  // Delete: 전시물 삭제
  deleteExhibition(id: string): Observable<any> {
    return forkJoin({
      exhibition: this.http.delete(`${this.apiUrl}/exhibitions/${id}`),
      intro: this.http.delete(`${this.apiUrl}/exhibition-intro/${id}`),
      docs: this.http.delete(`${this.apiUrl}/exhibition-docs/${id}`),
      members: this.http.delete(`${this.apiUrl}/exhibition-members/${id}`)
    });
  }
}

export class ExhibitionserviceService {
}
