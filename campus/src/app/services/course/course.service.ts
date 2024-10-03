// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // HttpHeaders 추가
import { Observable } from 'rxjs';
import { CourseResponseData } from '../../models/course/courses/course-response.interface'; // 인터페이스 경로 수정
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { DocNameResponseData } from 'src/app/models/course/doc_name/doc_name-response.interface';
import { CourseDocResponseData } from 'src/app/models/course/course_doc/course_doc-response.interface';
import { VideoTopicResponseData } from 'src/app/models/course/video_topic/video_topic-response.interface';
import { VideoResponseData } from 'src/app/models/course/video/video-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private courseApiUrl = 'http://localhost:3000/courses'; // 강의 관련 API URL
  private docNameApiUrl = this.courseApiUrl + '/${course_id}/docNames'; // 학습 자료 주제 관련 API URL
  private courseDocApiUrl = this.courseApiUrl + '/${course_id}/docNames/${doc_name_id}/courseDocs'; // 학습 자료 주제 관련 API URL
  private videoTopicApiUrl = this.courseApiUrl + '/${course_id}/videoTopics'; // 학습 자료 주제 관련 API URL
  private videoApiUrl = this.courseApiUrl + '/${course_id}/videoTopics/${video_topic_id}/video'; // 학습 자료 주제 관련 API URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in localStorage');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  createCourse(courseData: any): Observable<ApiResponse<CourseResponseData>> {
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

    return this.http.post<ApiResponse<CourseResponseData>>(`${this.courseApiUrl}/register`, courseData, { headers });
  }

  // 모든 강의 정보를 불러오는 메서드
  getAllCourses(): Observable<ApiResponse<CourseResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseResponseData[]>>(this.courseApiUrl, { headers });
  }

  updateCourse(courseId: number, courseData: any): Observable<ApiResponse<CourseResponseData>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.patch<ApiResponse<CourseResponseData>>(`${this.courseApiUrl}/${courseId}`, courseData, { headers }); // PUT 요청
  }

  // 강의 삭제 메서드 추가
  deleteCourse(courseId: string): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}`, { headers }); // DELETE 요청
  }
  
  // 2024-10-03
  // 학습 자료 주제 생성(POST)
  createDocName(courseId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/registerDN`, docNameData, { headers })
  }

  // // 학습 자료 주제 조회(GET | pa_topic_id이 null인 topic 조회)
  // getFirstDocName(courseId: number): Observable<ApiResponse<DocNameResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/first`, { headers })
  // }

  // // 학습 자료 주제 조회(GET | 특정 pa_topic_id를 갖는 topic 조회) => topic_id로 특정 pa_topic_id를 갖는 topic들 반환, 즉 파라미터로 받는 topic_id를 pa_topic_id로 하는 모든 topic 조회
  // getDocName(courseId: number, topicId: number): Observable<ApiResponse<DocNameResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}`, { headers })
  // }

  // 학습 자료 주제명 수정(PATCH)
  updateDocName(courseId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/registerDN`, docNameData, { headers })
  }

  // 학습 자료 주제 삭제(DELETE)
  deleteDocName(courseId: number, topic_id: number): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topic_id}`, { headers })
  }


}
