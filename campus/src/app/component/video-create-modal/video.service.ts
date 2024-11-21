// video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private ApiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
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
}