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
import { CourseWithCourseRegistrationResponseData } from 'src/app/models/course/courses/course-with-courseregistration-resoinse.interface';

@Component({
  selector: 'app-classmy',
  templateUrl: './classmy.page.html',
  styleUrls: ['./classmy.page.scss'],
})
export class ClassmyPage implements OnInit {
  course_id!: number;
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

  private async checkApprovalStatus(courseId: number): Promise<boolean> {
    try {
      if (!courseId || courseId === 0) {
        return false;
      }
  
      // 현재 유저의 course_registration만 확인
      const response: ApiResponse<CourseWithCourseRegistrationResponseData[]> = await firstValueFrom(
        this.courseService.getAllinqueryUsers(courseId)
      );
      
      // 현재 로그인한 유저의 registration만 필터링
      const currentUserRegistrations = response.data.find(registration => 
        registration.course_registration.some(reg => {
          console.log('Registration status:', reg.status);
          return reg.status === Registration.APPROVED;
        })
      );
  
      // 디버깅을 위한 로그
      console.log('Current user registrations:', currentUserRegistrations);
  
      // 강사인 경우 항상 접근 허용
      if (this.isInstructor()) {
        return true;
      }
  
      // 승인된 수강신청이 있는지 확인
      return !!currentUserRegistrations;
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
  
  async ngOnInit() {
    this.userRole = localStorage.getItem('Role') || '';
    
    // 관리자는 접근 불가
    if (this.userRole === Role.ADMIN) {
      this.router.navigate(['/classsignup']);
      return;
    }

    this.routeSubscription = this.route.paramMap.subscribe(async params => {
      const courseId = params.get('course_id');
      if (courseId) {
        this.course_id = +courseId;
        const isApproved = await this.checkApprovalStatus(this.course_id);
        
        if (!isApproved) {
          this.router.navigate(['/classnone']);
          return;
        }
        
        await this.loadCourses();
      } else {
        console.error('Course ID가 설정되지 않았습니다.');
        this.router.navigate(['/classnone']);
      }
    });
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
        video_pa_topic_id: videoTopic.video_pa_topic_id,
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
          video_pa_topic_id: videoTopic.video_pa_topic_id,
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

    setActiveSection(section: 'lecture' | 'material') {  // union type으로 타입 안정성 확보
      this.data.activeSection = section;
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

    async openVideoCreateModal() {
      const modal = await this.modalController.create({
        component: VideoCreateModalComponent,
      });
      return await modal.present();
    }


    }

    
