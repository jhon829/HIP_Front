import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course/course.service';
import { firstValueFrom } from 'rxjs';
import { DocNameResponseData } from '../../models/course/doc_name/doc_name-response.interface';
import { ApiResponse } from '../../models/common/api-response.interface';

@Component({
  selector: 'app-doc-topic',
  templateUrl: './doc-topic.component.html',
  styleUrls: ['./doc-topic.component.scss'],
})
export class DocTopicComponent implements OnInit {
  topLevelFolders: any[] = [];
  subFolders: any[] = [];
  currentFolder: any = null;
  showNewTopicForm: boolean = false;
  newDocTopicTitle: string = '';
  newDocTopicDesc: string = '';
  course_id = 14;
  isInputValid: boolean = false;
  showNewTopicInput: boolean = false;

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

      console.log('응답 데이터:', response.data);

      if (Array.isArray(response.data)) {
        this.topLevelFolders = response.data.map(docTopic => ({
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
      return;
    }

    const docTopicData = {
      topic_title: this.newDocTopicTitle,
      pa_topic_id: parseInt(this.newDocTopicDesc, 10)
    };

    console.log('전송할 문서 주제 데이터:', docTopicData);

    try {
      const response: ApiResponse<DocNameResponseData> = await firstValueFrom(
        this.courseService.createDocName(this.course_id, docTopicData)
      );
      console.log('문서 주제가 성공적으로 생성되었습니다:', response);

      this.topLevelFolders.push({
        topic_id: response.data.topic_id,
        topic_title: response.data.topic_title,
        pa_topic_id: response.data.pa_topic_id,
      });

      this.newDocTopicTitle = '';
      this.newDocTopicDesc = '';
      this.showNewTopicForm = false;

    } catch (error) {
      console.error('문서 주제 생성 중 오류 발생:', error);
    }
  }

  async deleteDoc(courseId: number, topicId: number) {
    const confirmed = confirm('이 비디오 주제를 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }
    try {
      const [response] = await Promise.all([firstValueFrom(this.courseService.deleteDocName(courseId, topicId))]);
      console.log(response.message);
      this.loadDocTopic();
    } catch (error) {
      console.error('비디오 주제 삭제 중 오류 발생', error);
    }
  }

  openFolder(folder: any) {
    this.currentFolder = folder;
    // 여기에 서브폴더를 로드하는 로직을 추가해야 합니다.
    // 예: this.loadSubFolders(folder.topic_id);
  }

  closeFolder() {
    this.currentFolder = null;
    this.subFolders = [];
  }
}
