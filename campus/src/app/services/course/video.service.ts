// video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private ApiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // }

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  uploadVideo(courseId: number, videoTitle: string, videoTopicId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('video_title', videoTitle);

    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.ApiUrl}/${courseId}/${videoTopicId}/video/upload`,
      formData,
      { headers }
    );
  }

  // 영상 조회(스트리밍, GET) => 추가적으로 로직 작성 필요
  streamVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<{ url: string }>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<{ url: string }>>(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/${videoId}/stream`, { headers })
  }
}