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
  VideoTopics: {
    video_topic_id: number;
    video_pa_topic_title: string; video_topic_title: string }[] = []; // 객체 배열로 변경
  course_id: number = 14; // courseId 저장
  lectureItems: Array<{ title: string; newCourseTitle: string }> = [];
  isEmptyState = true;  // 비어있는 상태인지 확인

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

  // index 위치에 새로운 항목을 추가하는 메서드
  addLectureItem(index: number) {
    this.lectureItems.splice(index + 1, 0, { title: '', newCourseTitle: '' });
  }

  // 새로운 항목을 추가하고 초기 상태를 해제
  addFirstLectureItem() {
    this.isEmptyState = false;  // 초기 상태를 해제
    this.lectureItems.push({ title: '', newCourseTitle: '' }); // 첫 항목 추가
  }



  //화면로드
  async loadCourses() {
    try {
      // ApiResponse에서 배열을 받도록 변경
      const response: ApiResponse<VideoTopicResponseData[]> = await firstValueFrom(
        this.courseService.getAllVideoTopic(this.course_id)
      );

      this.VideoTopics = response.data.map(videoTopic => ({
        video_topic_id: videoTopic.video_topic_id,
        video_topic_title: videoTopic.video_topic_title,
        video_pa_topic_title: videoTopic.video_pa_topic_title,
      }));

      // 로드 후 빈 배열 여부 확인 (필요할 경우)
      if (this.VideoTopics.length === 0) {
        console.log('비디오 주제가 없습니다.');
      } else {
        console.log('로드된 비디오 주제:', this.VideoTopics);
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  async deleteVideo(courseId: number, videoTopicId: number) {
    const confirmed = confirm('이 비디오 주제를 삭제하시겠습니까?'); // 삭제 확인 다이얼로그
    if (!confirmed) {
      return; // 사용자가 삭제를 취소한 경우
    }
    try {
      const response: ApiResponse<void> = await firstValueFrom(this.courseService.deleteVideoTopic(courseId, videoTopicId)); // 비디오 주제 삭제 API 호출
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadCourses(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('비디오 주제 삭제 중 오류 발생', error);
    }
  }




  // 비디오 주제를 생성하는 메서드
  async videotopicRegister(i: number) {
    const lectureItem = this.lectureItems[i]; // 현재 항목 가져오기
    if (!lectureItem.newCourseTitle) {
      return; // 제목이 없으면 실행하지 않음
    }

    // 비디오 주제를 생성할 때 사용할 데이터
    const videoTopicData = {
      video_topic_title: lectureItem.newCourseTitle,
      video_pa_topic_id: i+1 // 인덱스를 video_pa_topic_id로 설정
    };

    console.log('전송할 비디오 주제 데이터:', videoTopicData); // 확인용 로그

    try {
      const response = await firstValueFrom(
        this.courseService.createVideoTopic(this.course_id, videoTopicData)
      );
      console.log('비디오 주제가 성공적으로 생성되었습니다:', response);
      alert('비디오 주제가 성공적으로 생성되었습니다!');

      // 새 비디오 주제 정보를 lectureItem에 저장
      lectureItem.title = lectureItem.newCourseTitle; // 성공적으로 생성 후 제목 설정
      lectureItem.newCourseTitle = ''; // 입력 초기화
    } catch (error) {
      console.error('비디오 주제 생성 중 오류 발생:', error);
      alert('비디오 주제 생성에 실패했습니다.');
    }
  }




  // Alert 메시지 표시를 위한 메서드
  async showAlert(title: string, message: string) {
    alert(`${title}: ${message}`);
  }
}
