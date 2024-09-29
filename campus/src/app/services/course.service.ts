// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // HttpHeaders 추가
import { Observable } from 'rxjs';

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

  // 모든 강의 정보를 불러오는 메서드 추가
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.courseApiUrl}`);
  }

}
