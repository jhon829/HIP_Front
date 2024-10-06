import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CourseCreateModalComponent } from '../../../component/course-create-modal/course-create-modal.component';
import { CourseService } from '../../../services/course/course.service'; // CourseService 가져오기
import { firstValueFrom } from 'rxjs'; // firstValueFrom 가져오기
import { CourseResponseDto } from '../../../models/course/courses/course-response.interface'; // 인터페이스 경로 수정
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CreateCourseRegistrationDto } from '../../../models/course/courses/course-registration.interface';
import { Registration } from '../../../models/enums/role.enums';

@Component({
  selector: 'app-classsignup',
  templateUrl: './classsignup.page.html',
  styleUrls: ['./classsignup.page.scss'],
})

export class ClasssignupPage implements OnInit {
  courses: CourseResponseDto[] = []; // 가져온 강의 정보를 저장할 배열
  coursesRegistration : CreateCourseRegistrationDto[] = [];


  constructor(
    private modalController: ModalController,
    private courseService: CourseService // 서비스 주입
  ) {}

  ngOnInit() {
    this.loadCourses(); // 컴포넌트가 초기화될 때 강의 목록을 불러옴
  }

  async loadCourses() {
    try {
      const response: ApiResponse<CourseResponseDto[]> = await firstValueFrom(this.courseService.getAllCourses());
      this.courses = response.data; // response.data에서 배열 추출
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  async createCourse() {
    const modal = await this.modalController.create({
      component: CourseCreateModalComponent,
      cssClass: 'modal',
    });
    return await modal.present();
  }

  async updateCourse(course: CourseResponseDto) {
   // 1. 모달을 열어서 기존 강의 데이터를 전달하고 수정할 수 있게 함
    const modal = await this.modalController.create({
      component: CourseCreateModalComponent,
      cssClass: 'modal',
      componentProps: { course } // 기존 강의 데이터를 모달에 전달
    });

    // 2. 모달이 닫힌 후의 결과 처리
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        // 사용자가 수정을 완료하고 데이터를 반환했을 때
        try {
          const updatedCourse = result.data;
          const response = await firstValueFrom(this.courseService.updateCourse(course.course_id, updatedCourse));
          console.log('Course updated successfully:', response);

          // 3. 업데이트 후 강의 목록을 다시 불러옴
          this.loadCourses();
        } catch (error) {
          console.error('Error updating course:', error);
        }
      }
    });

    return await modal.present();
  }

  async deleteCourse(courseId: number) {
    const confirmed = confirm('이 강의를 삭제하시겠습니까?'); // 삭제 확인 다이얼로그
    if (!confirmed) {
      return; // 사용자가 삭제를 취소한 경우
    }
    try {
      const response: ApiResponse<void> = await firstValueFrom(this.courseService.deleteCourse(courseId,)); // 숫자를 문자열로 변환하여 삭제 API 호출
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadCourses(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('강의 삭제 중 오류 발생', error);
    }
  }

  async joinCourse(courseId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('토큰을 찾을 수 없습니다.');
      alert('로그인이 필요합니다.'); // 로그인이 필요함을 알림
      return;
    }

    const registrationData: CreateCourseRegistrationDto = {
      course_reporting_date: new Date().toISOString(), // 현재 날짜 ISO 형식
      course_registration_status: Registration.PENDING, // 예: 대기 상태
      userId: 1, // 로그인한 사용자 ID
      courseId: courseId, // 전달받은 강의 ID
    };

    try {
      const response: ApiResponse<void> = await firstValueFrom(this.courseService.joinCourse(courseId,registrationData)); // joinCourse 메서드 호출
      console.log('강의 신청 성공:', response.message);
      alert('강의 신청이 완료되었습니다.'); // 신청 완료 알림
    } catch (error) {
      console.error('강의 신청 중 오류 발생:', error);
      alert('강의 신청 중 오류가 발생했습니다.'); // 오류 알림
    }
  }

  async userInquiry(){



  }


}
