import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CourseResponseDto } from '../../../models/course/courses/course-response.interface';
import { VideoTopicResponseData } from '../../../models/course/video_topic/video_topic-response.interface';
import { CourseService } from '../../../services/course/course.service';
import { ApiResponse } from '../../../models/common/api-response.interface';

@Component({
  selector: 'app-classmy',
  templateUrl: './classmy.page.html',
  styleUrls: ['./classmy.page.scss'],
})
export class ClassmyPage implements OnInit {
  activeSection: string = 'lecture'; // 기본적으로 강의 목록을 활성화
  newCourseTitle: string = ''; // 새 강의 제목을 저장하는 변수
  VideoTopics: string[] = []; // 배열 타입으로 변경 (string[]로 대단원 제목을 담음)
  course_id: number = 14; // courseId 저장

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {
    // this.courseId = +this.route.snapshot.paramMap.get('courseId'); // courseId를 경로에서 가져오기
  }

  ngOnInit() {
    // 페이지가 로드될 때 강의 주제 로드
    this.loadCourses();
  }

  setActiveSection(section: string) {
    this.activeSection = section; // 클릭한 섹션으로 활성화 변경
  }

  async loadCourses() {
    try {
      // ApiResponse에서 배열을 받도록 변경
      const response: ApiResponse<VideoTopicResponseData[]> = await firstValueFrom(
        this.courseService.getAllVideoTopic(this.course_id)
      );

      // video_pa_topic_title만 추출해서 배열에 저장
      this.VideoTopics = response.data.map(VT => VT.video_pa_topic_title);
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  async videotopicRegister() {
    if (!this.newCourseTitle) {
      return;
    }

    const videoTopicData = { title: this.newCourseTitle };

    try {
      const response = await firstValueFrom(
        this.courseService.createVideoTopic(this.course_id, videoTopicData)
      );
      console.log('Video topic created successfully:', response);
      await this.showAlert('성공', '비디오 주제가 성공적으로 생성되었습니다.');
      this.newCourseTitle = ''; // 성공적으로 제출 후 입력 초기화
    } catch (error) {
      console.error('Error creating video topic:', error);
      await this.showAlert('실패', '비디오 주제 생성에 실패했습니다.');
    }
  }

  // Alert 메시지 표시를 위한 메서드
  async showAlert(title: string, message: string) {
    alert(`${title}: ${message}`);
  }
}
