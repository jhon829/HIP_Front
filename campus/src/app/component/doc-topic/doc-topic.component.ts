import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course/course.service';
import { firstValueFrom } from 'rxjs';
import { DocNameResponseData } from '../../models/course/doc_name/doc_name-request.interface';
import { ApiResponse } from '../../models/common/api-response.interface';

@Component({
  selector: 'app-doc-topic',
  templateUrl: './doc-topic.component.html',
  styleUrls: ['./doc-topic.component.scss'],
})
export class DocTopicComponent implements OnInit {
  topLevelFolders: DocNameResponseData[] = [];
  subFolders: DocNameResponseData[] = [];
  currentFolder: DocNameResponseData | null = null;
  showNewTopicForm: boolean = false;
  newTopicTitle: string = '';
  course_id = 14;
  isInputValid: boolean = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadTopLevelFolders();
  }

  async loadTopLevelFolders() {
    this.isLoading = true;
    this.errorMessage = null;

    try {
        const response = await firstValueFrom(
            this.courseService.getFirstDocName(this.course_id)
        );
        
        // root 응답은 이미 최상위 폴더만 반환하므로 필터링이 불필요
        this.topLevelFolders = Array.isArray(response.data) 
            ? response.data 
            : [response.data];
        
    } catch (error) {
        this.errorMessage = '상위 폴더를 불러오는 중 오류가 발생했습니다.';
        console.error('상위 폴더 로드 에러:', error);
    } finally {
        this.isLoading = false;
    }
  }

  async loadSubFolders(parentId: number) {
    this.isLoading = true;
    this.errorMessage = null;

    try {
        const response = await firstValueFrom(
            this.courseService.getDocName(this.course_id, parentId)
        );
        
        // sub_topics가 있는 경우 그것을 사용하고, 없으면 빈 배열
        this.subFolders = response.data.sub_topics || [];
        
    } catch (error) {
        this.errorMessage = '하위 폴더를 불러오는 중 오류가 발생했습니다.';
        console.error('하위 폴더 로드 에러:', error);
    } finally {
        this.isLoading = false;
    }
  }

  openFolder(folder: DocNameResponseData) {
    this.currentFolder = folder;
    this.loadSubFolders(folder.topic_id);
  }

  closeFolder() {
    this.currentFolder = null;
    this.subFolders = [];
    this.loadTopLevelFolders();
  }

  showAddTopicForm() {
    this.showNewTopicForm = true;
    this.newTopicTitle = '';
    this.isInputValid = false;
  }

  validateInput() {
    this.isInputValid = this.newTopicTitle.trim() !== '';
  }

  async createTopic() {
    if (!this.isInputValid) return;

    const docTopicData = {
      topic_title: this.newTopicTitle,
      pa_topic_id: this.currentFolder ? this.currentFolder.topic_id : null
    };

    try {
      const response: ApiResponse<DocNameResponseData> = await firstValueFrom(
        this.courseService.createDocName(this.course_id, docTopicData)
      );
      console.log('폴더가 성공적으로 생성되었습니다:', response);

      if (this.currentFolder) {
        this.subFolders.push(response.data);
      } else {
        this.topLevelFolders.push(response.data);
      }

      this.newTopicTitle = '';
      this.showNewTopicForm = false;
    } catch (error) {
      console.error('폴더 생성 중 오류 발생:', error);
    }
  }

  async deleteDoc(topicId: number) {
    const confirmed = confirm('이 폴더를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await firstValueFrom(this.courseService.deleteDocName(this.course_id, topicId));
      if (this.currentFolder) {
        this.subFolders = this.subFolders.filter(folder => folder.topic_id !== topicId);
      } else {
        this.topLevelFolders = this.topLevelFolders.filter(folder => folder.topic_id !== topicId);
      }
    } catch (error) {
      console.error('폴더 삭제 중 오류 발생:', error);
    }
  }
}
