// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // HttpHeaders 추가
import { Observable } from 'rxjs';
import { CourseResponse } from '../services/course-response.interface'; // 인터페이스 경로 수정

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private courseApiUrl = 'http://localhost:3000/courses'; // 강의 관련 API URL

  constructor(private http: HttpClient) {}

  createCourse(courseData: any): Observable<any> {
    const token = localStorage.getItem('token');

    // 토큰이 제대로 불러와지는지 확인하는 로그
    if (!token) {
      console.error('토큰을 찾을 수 없습니다.');
    } else {
      console.log('불러온 토큰:', token);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 인증 헤더 추가
    });

    return this.http.post<any>(`${this.courseApiUrl}/register`, courseData, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in localStorage');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 모든 강의 정보를 불러오는 메서드
  getCourses(): Observable<CourseResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<CourseResponse>(this.courseApiUrl, { headers });
  }

  // 강의 삭제 메서드 추가
  deleteCourse(courseId: string): Observable<any> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete(`${this.courseApiUrl}/${courseId}`, { headers }); // DELETE 요청
  }




}
