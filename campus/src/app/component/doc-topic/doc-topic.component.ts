import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course/course.service'; // 필요한 서비스 import
import { firstValueFrom } from 'rxjs';
import { DocNameResponseData } from '../../models/course/doc_name/doc_name-response.interface'; // DTO import
import { ApiResponse } from '../../models/common/api-response.interface';

@Component({
  selector: 'app-doc-topic',
  templateUrl: './doc-topic.component.html',
  styleUrls: ['./doc-topic.component.scss'],
})
export class DocTopicComponent implements OnInit {
  DocTopics: any[] = [];
  showNewTopicForm: boolean = false;
  newDocTopicTitle: string = '';
  newDocTopicDesc: string = '';
  course_id=14;
  isInputValid: boolean = false;
  showNewTopicInput: boolean = false; // 새 항목 입력 필드 표시 여부

  constructor(private courseService: CourseService) {}

  ngOnInit() {
  }

  showAddTopicForm() {
    this.showNewTopicForm = true;
    this.newDocTopicTitle = '';
    this.newDocTopicDesc = '';
    this.isInputValid = false;
  }

  validateInputs() {
    this.isInputValid = this.newDocTopicTitle.trim() !== '' && this.newDocTopicDesc.trim() !== '';
  }

  async createDocTopic() {
    if (!this.isInputValid) {
      return;
    }

    const docTopicData = {
      topic_title: this.newDocTopicTitle,
      pa_topic_id: parseInt(this.newDocTopicDesc, 10) // 문자열을 숫자로 변환
    };

    console.log('전송할 문서 주제 데이터:', docTopicData);

    try {
      const response: ApiResponse<DocNameResponseData> = await firstValueFrom(
        this.courseService.createDocName(this.course_id, docTopicData)
      );
      console.log('문서 주제가 성공적으로 생성되었습니다:', response);

      // 새 문서 주제 정보를 DocTopics에 추가
      this.DocTopics.push(response.data);
      this.showNewTopicForm = false; // 폼 숨기기
      this.newDocTopicTitle = '';
      this.newDocTopicDesc = '';
    } catch (error) {
      console.error('문서 주제 생성 중 오류 발생:', error);

    }
  }
}
