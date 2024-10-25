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
  async loadDocTopic(){

  }

  async createDocTopic() {
    if (!this.isInputValid) {
      return; // 입력 유효성 검사
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

      // 데이터베이스에만 저장하고, UI에서는 새 항목을 추가하지 않음
      this.newDocTopicTitle = ''; // 입력 초기화
      this.newDocTopicDesc = ''; // 입력 초기화
    } catch (error) {
      console.error('문서 주제 생성 중 오류 발생:', error);
      // 오류 처리 로직 추가 가능
    }
  }

}
