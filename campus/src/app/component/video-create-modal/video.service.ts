import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private ApiUrl = 'http://localhost:3000/courses';
  constructor(
    private http: HttpClient
  ) { }

  uploadVideo(courseId: number, videoTopicId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // 비디오 파일 추가
    return this.http.post(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/upload`, formData);
  }
}
