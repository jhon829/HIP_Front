import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs'; // firstValueFrom 임포트
import { ActivatedRoute } from '@angular/router'; // courseId를 경로에서 가져옴
import { VideoTopicResponseData } from '../../../models/course/video_topic/video_topic-response.interface';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-classmy',
  templateUrl: './classmy.page.html',
  styleUrls: ['./classmy.page.scss'],
})
export class ClassmyPage implements OnInit {
  activeSection: string = 'lecture'; // 기본적으로 강의 목록을 활성화
  newCourseTitle: string = ''; // 새 강의 제목을 저장하는 변수
  courses: string[] = []; // 생성된 강의 목록을 저장하는 배열
  courseId: number;  // courseId 저장



  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('courseId'); // courseId를 경로에서 가져오기
  }

  ngOnInit() {
    // 초기화 로직이 필요하다면 여기에 작성
  }

  setActiveSection(section: string) {
    this.activeSection = section; // 클릭한 섹션으로 활성화 변경
  }

  /*async confirmCourse() {
    if (this.newCourseTitle) {
      try {
        // 강의 생성 요청
        const courseData = { course_title: this.newCourseTitle }; // 필드 이름에 맞추어 객체 생성
        const response = await firstValueFrom(this.authService.createCourse(courseData)); // 수정된 부분
        // 서버 응답 처리
        console.log(response);

        // 강의 목록에 추가
        this.courses.push(this.newCourseTitle);
        this.newCourseTitle = ''; // 입력 필드 초기화
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }*/

  async videotopicRegister() {
    if (!this.newCourseTitle) {
      return;
    }

    const videoTopicData = { title: this.newCourseTitle };

    try {
      // firstValueFrom을 사용하여 Observable 처리
      const response = await firstValueFrom(
        this.courseService.createVideoTopic(this.courseId, videoTopicData)
      );
      console.log('Video topic created successfully:', response);

      // 성공 시 Alert 띄우기
      await this.showAlert('성공', '비디오 주제가 성공적으로 생성되었습니다.');

      // 성공 후 입력 필드 초기화
      this.newCourseTitle = '';
    } catch (error) {
      console.error('Error creating video topic:', error);
      // 오류 발생 시 Alert 띄우기
      await this.showAlert('실패', '비디오 주제 생성에 실패했습니다.');
    }
  }

  // Alert 메시지 표시를 위한 메서드
  async showAlert(title: string, message: string) {
    alert(`${title}: ${message}`);
  }

}
