// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // HttpHeaders 추가
import { Observable } from 'rxjs';
import { CourseResponseDto } from '../../models/course/courses/course-response.interface'; // 인터페이스 경로 수정
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CreateCourseRegistrationDto } from '../../models/course/courses/course-registration.interface';
import { DocNameResponseData } from 'src/app/models/course/doc_name/doc_name-response.interface';
import { CourseDocResponseData } from 'src/app/models/course/course_doc/course_doc-response.interface';
import { VideoTopicResponseData } from 'src/app/models/course/video_topic/video_topic-response.interface';
import { VideoResponseData } from 'src/app/models/course/video/video-response.interface';


@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private courseApiUrl = 'http://localhost:3000/courses'; // 강의 관련 API URL
  /*private courseRegisApiUrl = `http://localhost:3000/courses/${courseId}/courseRegistration`; //강의 신청 관련 API URL*/


  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  createCourse(courseData: any): Observable<ApiResponse<CourseResponseDto>> {
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

    return this.http.post<ApiResponse<CourseResponseDto>>(`${this.courseApiUrl}/register`, courseData, { headers });
  }


  /*course CRUD*/

  // 모든 강의 정보를 불러오는 메서드
  getAllCourses(): Observable<ApiResponse<CourseResponseDto[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseResponseDto[]>>(this.courseApiUrl, { headers });
  }

  // 특정 강의 정보를 불러오는 메서드
  getOneCourses(courseId: number): Observable<ApiResponse<CourseResponseDto[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseResponseDto[]>>(`${this.courseApiUrl}/${courseId}/read`, { headers });
  }

  // 강의 정보 수정
  updateCourse(courseId: number, courseData: any): Observable<ApiResponse<CourseResponseDto>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.patch<ApiResponse<CourseResponseDto>>(`${this.courseApiUrl}/course/${courseId}/update`, courseData, { headers }); // PUT 요청

  }

  // 강의 삭제 메서드 추가
  deleteCourse(courseId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/course/${courseId}/delete`, { headers }); // DELETE 요청
  }

  //course join(Post)
  /*
  joinCourse(courseId: number, registrationData: Omit<CreateCourseRegistrationDto, 'userId'>): Observable<ApiResponse<CreateCourseRegistrationDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 인증 헤더 추가
    }); // 인증 헤더 가져오기ㅋ

    const url = `${this.courseApiUrl}/${courseId}/courseRegistrationcourses/${courseId}/courseRegistration/register`; // courseId를 사용해 URL 구성
    return this.http.post<ApiResponse<CreateCourseRegistrationDto>>(url, registrationData, { headers });
  }
  */


  //수강 신청 받음
  joinCourse(courseId: number, registrationData: CreateCourseRegistrationDto): Observable<ApiResponse<CreateCourseRegistrationDto>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    const url = `${this.courseApiUrl}/${courseId}/courseRegistration/register`; // 올바른 URL 구성
    return this.http.post<ApiResponse<CreateCourseRegistrationDto>>(url, registrationData, { headers }); // POST 요청으로 변경
  }



  getAllJoinUsers(): Observable<ApiResponse<CreateCourseRegistrationDto[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CreateCourseRegistrationDto[]>>(this.courseApiUrl, { headers });
  }

  // 강의 삭제 메서드 추가
  canceljoinCourse(courseId: number,course_registration_id:number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/courseRegistration/${course_registration_id}/delete`, { headers }); // DELETE 요청
  }



  // 2024-10-03
  // 학습 자료 주제 생성(POST)
  createDocName(courseId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/registerDN`, docNameData, { headers })
  }

  // 학습 자료 주제 조회(GET | pa_topic_id이 null인 topic 조회)
  getFirstDocName(courseId: number): Observable<ApiResponse<DocNameResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<DocNameResponseData[]>>(`${this.courseApiUrl}/${courseId}/docNames/root`, { headers })
  }

  //학습 주제 전체 조회
  getAllDocName(courseId: number): Observable<ApiResponse<DocNameResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<DocNameResponseData[]>>(`${this.courseApiUrl}/${courseId}/docNames/allDN`, { headers })
  }


  // 학습 자료 주제 조회(GET | 특정 pa_topic_id를 갖는 topic 조회) => topic_id로 특정 pa_topic_id를 갖는 topic들 반환, 즉 파라미터로 받는 topic_id를 pa_topic_id로 하는 모든 topic 조회
  getDocName(courseId: number, topicId: number): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/read`, { headers })
  }

  // 학습 자료 주제명 수정(PATCH)
  updateDocName(courseId: number, topicId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/update`, docNameData, { headers })
  }

  // 학습 자료 주제 삭제(DELETE)
  deleteDocName(courseId: number, topicId: number): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/delete`, { headers })
  }

  // 학습 자료 생성(POST | 파일 업로드)
  createCourseDoc(courseId: number, topicId: number, CourseDocData: any): Observable<ApiResponse<CourseDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<CourseDocResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs/register`, CourseDocData, { headers })
  }

  // 학습 자료 조회(GET | 특정 topic_id에 속한 course_doc 전체 조회)
  getAllCourseDoc(courseId: number, topicId: number): Observable<ApiResponse<CourseDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseDocResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs`, { headers })
  }

  // 학습 자료 다운로드(GET)
  downloadCourseDoc(courseId: number, topicId: number, fileUrl: string): Observable<ApiResponse<CourseDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseDocResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs/download/${fileUrl}`, { headers })
  }

  // 학습 자료 삭제(DELETE)
  deleteCourseDoc(courseId: number, topicId: number, courseDocId: number): Observable<ApiResponse<CourseDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<CourseDocResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs/download/${courseDocId}`, { headers })
  }

  // 영상 주제 생성(POST)
  createVideoTopic(courseId: number, VideoTopicData: any): Observable<ApiResponse<VideoTopicResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<VideoTopicResponseData>>(`${this.courseApiUrl}/${courseId}/videoTopics/registerVT`, VideoTopicData, { headers })
  }

  // 영상 주제 조회(GET | 전체 조회)
  getAllVideoTopic(courseId: number | null): Observable<ApiResponse<VideoTopicResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<VideoTopicResponseData[]>>(`${this.courseApiUrl}/${courseId}/videoTopics/allVT2`, { headers });
  }

  // 영상 주제 수정(PATCH)
  updateVideoTopic(courseId: number, videoTopicId: number, VideoTopicData: any): Observable<ApiResponse<VideoTopicResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<VideoTopicResponseData>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/update`, VideoTopicData, { headers })
  }

  // 영상 주제 삭제(DELETE)
  deleteVideoTopic(courseId: number, videoTopicId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/delete`, { headers });
  }

  // 영상 생성(업로드, POST)
  createVideo(courseId: number, videoTopicId: number, VideoData: any): Observable<ApiResponse<VideoResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<VideoResponseData>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/video/upload`, VideoData, { headers })
  }

  // 영상 조회(스트리밍, GET) => 추가적으로 로직 작성 필요
  streamVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<VideoResponseData>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/video/${videoId}/stream`, { headers })
  }

  // 영상 삭제(DELETE)
  deleteVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<VideoResponseData>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/video/${videoId}/delete`, { headers })
  }

}
