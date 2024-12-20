import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "src/app/models/common/api-response.interface";
import { FeedbackRequestData } from "src/app/models/project/feedback/feedback-request.interface";
import { FeedbackResponseData } from "src/app/models/project/feedback/feedback-response.interface";
import { ProjectDocResponseData } from "src/app/models/project/project_doc/project_doc-response.interface";
import { ProjectResponseData } from "src/app/models/project/projects/projects-response.interface";

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectApiUrl = 'http://localhost:3000/projects'; // 실제 API URL로 변경하세요.

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // projects
  createProject(projectData: Partial<ProjectResponseData>): Observable<ApiResponse<ProjectResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<ProjectResponseData>>(
      `${this.projectApiUrl}/register`,
      projectData, 
      { headers }
    );
  }

  getAllProjects(): Observable<ApiResponse<ProjectResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<ProjectResponseData[]>>(
      `${this.projectApiUrl}`, 
      { headers }
    );
  }

  // 단일 프로젝트 가져오기
  getProjectById(id: number): Observable<ApiResponse<ProjectResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<ProjectResponseData>>(
      `${this.projectApiUrl}/${id}`,
      { headers }
    );
  }

  updateProject(id: number, projectData: any): Observable<ApiResponse<ProjectResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<ProjectResponseData>>(
      `${this.projectApiUrl}/${id}/update`,
      projectData,
      { headers }
    );
  }

  deleteProject(id: number): Observable<ApiResponse<ProjectResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<ProjectResponseData>>(
      `${this.projectApiUrl}/${id}/delete`,
      { headers }
    );
  }

  // project_doc
  createProjectDoc(projectId: number, projectDocData: any): Observable<ApiResponse<ProjectDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<ProjectDocResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/register`,
      projectDocData,
      { headers }
    );
  }

  getAllProjectDoc(projectId: number): Observable<ApiResponse<ProjectDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<ProjectDocResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs`,
      { headers }
    );
  }

  getOneProjectDoc(projectId: number, projectDocId: number): Observable<ApiResponse<ProjectDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<ProjectDocResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/read`,
      { headers }
    );
  }

  updateProjectDoc(projectId: number, projectDocId: number, projectDocData: any): Observable<ApiResponse<ProjectDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.put<ApiResponse<ProjectDocResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/update`,
      projectDocData,
      { headers }
    );
  }

  deleteProjectDoc(projectId: number, projectDocId: number): Observable<ApiResponse<ProjectDocResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<ProjectDocResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/delete`,
      { headers }
    );
  }

  // feedback
  createFeedback(projectId: number, projectDocId: number, feedbackData: FeedbackRequestData): Observable<ApiResponse<FeedbackResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<FeedbackResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/feedback/register`,
      feedbackData,
      { headers }
    );
  }

  getAllFeedback(projectId: number, projectDocId: number, feedbackId: number): Observable<ApiResponse<FeedbackResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<FeedbackResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/feedback/${feedbackId}`,
      { headers }
    );
  }

  updateFeedback(projectId: number, projectDocId: number, feedbackId: number, feedbackData: any): Observable<ApiResponse<FeedbackResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<FeedbackResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/feedback/${feedbackId}/update`,
      feedbackData,
      { headers }
    );
  }

  deleteFeedback(projectId: number, projectDocId: number, feedbackId: number): Observable<ApiResponse<FeedbackResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<FeedbackResponseData>>(
      `${this.projectApiUrl}/${projectId}/projectDocs/${projectDocId}/feedback/${feedbackId}/delete`,
      { headers }
    );
  }
}
