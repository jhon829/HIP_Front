import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VideoTopicRequestData } from '../../../models/course/video_topic/video_topic-request.interface';
import { CourseService } from '../../../services/course/course.service';
import { ApiResponse } from '../../../models/common/api-response.interface';
import { ClassmyResponseData } from '../../../models/course/dummy/classmy/classmy-response.interface'
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VideoCreateModalComponent } from '../../../component/video-create-modal/video-create-modal.component';
import { Registration, Role } from 'src/app/models/enums/role.enums';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-classmy',
  templateUrl: './classmy.page.html',
  styleUrls: ['./classmy.page.scss'],
})
export class ClassmyPage implements OnInit {
  course_id: number = 0;
  private routeSubscription?: Subscription;
  userRole: string = '';

  public data: ClassmyResponseData = {
    VideoTopics: [],
    activeSection: 'lecture',
    isEmptyState: true,
    lectureItems: []
  };

  constructor(
    private courseService: CourseService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  // approved인지 확인하는 메서드 , 이게 문제있는듯
  private async checkApprovalStatus(courseId: number): Promise<boolean> {
    console.log('Checking approval for courseId:', courseId);
    const userIdString = localStorage.getItem('UserId') || '';
    console.log(userIdString)
    const userId = Number(userIdString)
    try {
        if (!courseId || courseId === 0) {
            return false;
        }

        // 강사인 경우 항상 접근 허용
        if (this.isInstructor()) {
            return true;
        }

        // 해당 courseId에 대한 registration 정보만 조회
        const response = await firstValueFrom(
            this.courseService.getRegistration(courseId, userId)
        );

        console.log('API Response:', response.data);
        console.log('API Response2:', response.data.course_registration_id);
        console.log('API Response3:', response.data.user);
        console.log('API Response4:', response.data.course);
        console.log('check1:', response?.data.course_registration_status === Registration.APPROVED)
        console.log('check2:', Number(response.data.user?.user_id) === userId)
        console.log('check3:', response.data.course?.course_id === courseId)

        // null 체크와 타입 검사를 포함한 조건문
        const isApproved = Boolean(
          response?.data.course_registration_status === Registration.APPROVED &&
          Number(response.data.user?.user_id) === userId &&
          response.data.course?.course_id === courseId
      );

      console.log('Approval status:', isApproved);
      return isApproved;

    } catch (error) {
        console.error('Approval check failed:', error);
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 401:
                    this.router.navigate(['/loginpage']);
                    break;
                case 404:
                    console.error('Course not found');
                    break;
                default:
                    console.error('API error:', error);
            }
        }
        return false;
    }
}

  // ngOnInit 수정
  async ngOnInit() {
    this.userRole = localStorage.getItem('Role') || '';
    
    // 관리자는 접근 불가
    if (this.userRole === Role.ADMIN) {
        this.router.navigate(['/classsignup']);
        return;
    }

    try {
        // URL 파라미터에서 course_id 가져오기
        this.route.params.subscribe(params => {
            this.course_id = Number(params['course_id']);
            console.log('URL course_id:', this.course_id);
        });

        // course_id가 유효한지 확인
        if (!this.course_id) {
            console.error('Invalid course_id');
            this.router.navigate(['/classnone']);
            return;
        }

        const isApproved = await this.checkApprovalStatus(this.course_id);
        if (!isApproved) {
            this.router.navigate(['/classnone']);
            return;
        }

        // 강의 데이터 로드
        await this.loadCourses();
        
    } catch (error) {
        console.error('Course ID 처리 중 오류 발생:', error);
        this.router.navigate(['/classnone']);
    }
}

  // 강사 권한 체크
  isInstructor(): boolean {
    return this.userRole === Role.INSTRUCTOR;
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadCourses() {
    try {
      const response: ApiResponse<VideoTopicRequestData[]> = await firstValueFrom(
        this.courseService.getAllVideoTopic(this.course_id)
      );

      this.data.VideoTopics = response.data.map(videoTopic => ({
        video_topic_id: videoTopic.video_topic_id,
        video_topic_title: videoTopic.video_topic_title,
      }));

      if (this.data.VideoTopics.length === 0) {
        console.log('비디오 주제가 없습니다.');
      } else {
        console.log('로드된 비디오 주제:', this.data.VideoTopics);
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  // 모든 비디오 토픽을 가져오는 메서드
  async getAllVideoTopics() {
      try {
        const response: ApiResponse<VideoTopicRequestData[]> = await firstValueFrom(
          this.courseService.getAllVideoTopic(this.course_id)
        );

        this.data.VideoTopics = response.data.map(videoTopic => ({
          video_topic_id: videoTopic.video_topic_id,
          video_topic_title: videoTopic.video_topic_title,
        }));

        if (this.data.VideoTopics.length === 0) {
          console.log('비디오 주제가 없습니다.');
        } else {
          console.log('로드된 비디오 주제:', this.data.VideoTopics);
        }
      } catch (error) {
        console.error('비디오 주제 로드 중 오류 발생', error);
      }
  }

  setActiveSection(section: ClassmyResponseData['activeSection']) {
    this.data.activeSection = section;
    if (section === 'material') {
      // 학습자료 클릭 시 URL 변경
      this.router.navigate([`/classmy/${this.course_id}/doc-topics`]);
    }
  }

  // 새로운 항목을 추가하고 초기 상태를 해제
  addFirstLectureItem() {
      this.data.isEmptyState = false;  // 초기 상태를 해제
      this.data.lectureItems.push({ title: '', newCourseTitle: '' }); // 첫 항목 추가
  }

  // index 위치에 새로운 항목을 추가하는 메서드
  addLectureItem(index: number) {
      this.data.lectureItems.splice(index + 1, 0, { title: '', newCourseTitle: '' });
  }

  async deleteVideoTopic(courseId: number, videoTopicId: number) {
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


  async updateVideoTopic(courseId: number, videoTopicId: number, videoTopicData: VideoTopicRequestData) {
    try{
      const response: ApiResponse<VideoTopicRequestData> = await firstValueFrom(this.courseService.updateVideoTopic(courseId, videoTopicId, videoTopicData));
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadCourses();
    } catch (error) {
      console.error('비디오 수정 중 오류가 발생했습니다.', error);
    }
  }

  // 비디오 주제를 생성하는 메서드
  async videotopicRegister(i: number) {
      // null 체크를 명시적으로 수행
      if (!this.course_id) {
        console.error('courseId가 없습니다.');
        return;
      }
      const lectureItem = this.data.lectureItems[i]; // 현재 항목 가져오기
      if (!lectureItem.newCourseTitle) {
        return; // 제목이 없으면 실행하지 않음
      }

      const video_topic_title =  { video_topic_title: lectureItem.newCourseTitle }

      console.log('전송할 비디오 주제 데이터:', video_topic_title); // 확인용 로그

      try {
        // firstValueFrom은 Observable의 첫번째 값을 Promise로 변환하여 비동기로 처리, API 호출 완료까지 대기하는 메서드
        const response = await firstValueFrom(
          this.courseService.createVideoTopic(this.course_id, video_topic_title)
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

  async openVideoCreateModal(videoTopicId: number | null) {
    if (!videoTopicId) {
      alert('올바른 비디오 토픽이 아닙니다.');
      return;
    }
    const modal = await this.modalController.create({
      component: VideoCreateModalComponent,
      componentProps: {
        courseId: this.course_id,
        videoTopicId: videoTopicId  // 파라미터로 받은 VideoTopic ID를 전달
      }
    });

    const result = await modal.present();
    return result;
  }
}

    
