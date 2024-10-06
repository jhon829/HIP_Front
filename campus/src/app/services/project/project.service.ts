import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "src/app/models/common/api-response.interface";
import { FeedbackResponseData } from "src/app/models/project/feedback/feedback-response.interface";
import { ProjectDocResponseData } from "src/app/models/project/project_doc/project_doc-response.interface";
import { ProjectResponseData } from "src/app/models/project/projects/projects-response.interface";


@Injectable({
    providedIn: 'root',
  })

  export class ProjectService {
    private projectApiUrl = 'http://localhost:3000/projects'; // 실제 API URL로 변경하세요.

    constructor(private http: HttpClient) {}

    // projects
    createProject(projectData: any): Observable<ApiResponse<ProjectResponseData>> {
        return this.http.post<ApiResponse<ProjectResponseData>>(`${this.projectApiUrl}/register`, projectData);
    }

    getAllProject(): Observable<ApiResponse<ProjectResponseData>> {
        return this.http.get<ApiResponse<ProjectResponseData>>(`${this.projectApiUrl}`);
    }

    updateProject(id: number, projectData: any): Observable<ApiResponse<ProjectResponseData>> {
        return this.http.patch<ApiResponse<ProjectResponseData>>(`${this.projectApiUrl}/${id}/update`, projectData);
    }
      
    deleteProject(id: number): Observable<ApiResponse<ProjectResponseData>> {
        return this.http.delete<ApiResponse<ProjectResponseData>>(`${this.projectApiUrl}/${id}/delete`);
    }

  }