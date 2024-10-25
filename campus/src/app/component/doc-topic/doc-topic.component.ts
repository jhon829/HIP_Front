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
    this.loadDocTopic();
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


  async loadDocTopic() {
    try {
      const response: ApiResponse<DocNameResponseData[]> = await firstValueFrom(
        this.courseService.getAllDocName(this.course_id)
      );

      console.log('응답 데이터:', response.data); // 응답 데이터 로그

      if (Array.isArray(response.data)) {
        // response.data가 배열일 경우에만 map을 사용합니다.
        this.DocTopics = response.data.map(docTopic => ({
          topic_id: docTopic.topic_id,
          topic_title: docTopic.topic_title,
          pa_topic_id: docTopic.pa_topic_id,
        }));
      } else {
        console.error('응답 데이터가 배열이 아닙니다:', response.data);
      }
    } catch (error) {
      console.error('문서 주제 로드 중 오류 발생:', error);
    }

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

      // 새로 생성된 주제를 즉시 DocTopics 배열에 추가
      this.DocTopics.push({
        topic_id: response.data.topic_id,
        topic_title: response.data.topic_title,
        pa_topic_id: response.data.pa_topic_id,
      });

      // 입력 필드 초기화
      this.newDocTopicTitle = '';
      this.newDocTopicDesc = '';

    } catch (error) {
      console.error('문서 주제 생성 중 오류 발생:', error);
    }
  }



  async deleteDoc(courseId: number, topicId: number) {
    const confirmed = confirm('이 비디오 주제를 삭제하시겠습니까?'); // 삭제 확인 다이얼로그
    if (!confirmed) {
      return; // 사용자가 삭제를 취소한 경우
    }
    try {
      const [response] = await Promise.all([firstValueFrom(this.courseService.deleteDocName(courseId, topicId))]); // 비디오 주제 삭제 API 호출
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadDocTopic(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('비디오 주제 삭제 중 오류 발생', error);
    }
  }

}
