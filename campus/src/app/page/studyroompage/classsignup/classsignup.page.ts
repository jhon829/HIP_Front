import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CourseCreateModalComponent } from '../../../component/course-create-modal/course-create-modal.component';
import { CourseService } from '../../../services/course/course.service'; // CourseService 가져오기
import { firstValueFrom } from 'rxjs'; // firstValueFrom 가져오기
import { CourseResponseDto } from '../../../models/course/courses/course-response.interface'; // 인터페이스 경로 수정
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CreateCourseRegistrationDto } from '../../../models/course/courses/course-registration.interface';
import { Registration } from '../../../models/enums/role.enums';
import { HttpErrorResponse } from '@angular/common/http';
/*
interface DecodedToken {
  user_id: number;
  // 필요한 경우 다른 토큰 필드들을 여기에 추가하세요
}*/

@Component({
  selector: 'app-classsignup',
  templateUrl: './classsignup.page.html',
  styleUrls: ['./classsignup.page.scss'],
})




export class ClasssignupPage implements OnInit {
  registeredCourses: Set<number> = new Set(); // 신청한 강의 ID를 저장할 Set
  courses: CourseResponseDto[] = []; // 가져온 강의 정보를 저장할 배열
  coursesRegistration : CreateCourseRegistrationDto[] = [];



  constructor(
    private modalController: ModalController,
    private courseService: CourseService // 서비스 주입
  ) {}

  ngOnInit() {
    this.loadCourses(); // 컴포넌트가 초기화될 때 강의 목록을 불러옴
    this.courseJoinUser(); //이게 실행되면 페이지에 load가 되지 않는 오류가 ㅣㅇㅆ음
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
      const response: ApiResponse<void> = await firstValueFrom(this.courseService.deleteCourse(courseId)); // 숫자를 문자열로 변환하여 삭제 API 호출
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadCourses(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('강의 삭제 중 오류 발생', error);
    }
  }

  async getCurrentDate(): Promise<Date> {
    return new Date(); // 현재 날짜를 Date 객체로 반환
  }

  /*
  //11-06 : Date 상태
  async joinCourse(courseId: number) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('토큰을 찾을 수 없습니다.');
    alert('로그인이 필요합니다.');
    return;
  }

  try {
    const courseReportingDate = await this.getCurrentMonthDay();
    const registrationData: CreateCourseRegistrationDto = {
      course_reporting_date: courseReportingDate,
      course_registration_status: Registration.PENDING,
    };

    const response: ApiResponse<CreateCourseRegistrationDto> = await firstValueFrom(
      this.courseService.joinCourse(courseId, registrationData)
    );
    console.log('강의 신청 성공:', response.message);
    alert('강의 신청이 완료되었습니다.');
    this.registeredCourses.add(courseId);
  } catch (error) {
    if (error instanceof HttpErrorResponse) {
      // HTTP 오류 처리
      const errorMessage = error.error?.message || '알 수 없는 오류가 발생했습니다.';
      console.error('강의 신청 중 오류 발생:', errorMessage);
      alert(`오류: ${errorMessage}`);
    } else {
      // 일반 오류 처리
      console.error('강의 신청 중 예상치 못한 오류:', error);
      alert('강의 신청 중 예상치 못한 오류가 발생했습니다.');
    }
  }
}

  */

  async joinCourse(courseId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('토큰을 찾을 수 없습니다.');
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const courseReportingDate = await this.getCurrentDate(); // Date 객체 가져오기
      const registrationData: CreateCourseRegistrationDto = {
        course_reporting_date: courseReportingDate.toISOString(), // ISO 문자열로 변환하여 설정
        course_registration_status: Registration.PENDING,
      };

      const response: ApiResponse<CreateCourseRegistrationDto> = await firstValueFrom(
        this.courseService.joinCourse(courseId, registrationData)
      );
      console.log('강의 신청 성공:', response.message);
      alert('강의 신청이 완료되었습니다.');
      this.registeredCourses.add(courseId);
    } catch (error) {
      // 오류 처리 코드
      console.error('강의 신청 중 오류 발생:', error);
      alert('강의 신청 중 오류가 발생했습니다.');
    }
  }






  //현재 강의를 신청했는지에 대한 변수
  isRegistered(courseId: number): boolean {
    return this.registeredCourses.has(courseId); // 강의 ID가 Set에 존재하는지 확인
  }


  //신청하기
  async courseJoinUser() {
    try {
      const response: ApiResponse<any> = await firstValueFrom(this.courseService.getAllJoinUsers());

      // 응답이 객체일 경우 적절히 배열로 변환
      this.coursesRegistration = response.data.registrations || [];

      console.log('Loaded courses:', this.coursesRegistration);
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }


  /*//취소하기 기능
  async cancelRegistration(courseId: number) {
    const confirmed = confirm('수강 신청을 취소하시겠습니까?');
    if (!confirmed) {
      return;
    }

    // courseId에 해당하는 등록 ID 가져오기
    const registrationId = this.getRegistrationId(courseId);
    if (!registrationId) {
      console.error('등록 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      // 강의 취소 요청
      const response: ApiResponse<void> = await firstValueFrom(this.courseService.canceljoinCourse(courseId, registrationId));
      console.log(response.message);
      alert('수강 신청이 취소되었습니다.');
      this.registeredCourses.delete(courseId); // 신청 목록에서 삭제
      this.courseJoinUser(); // 목록 갱신
    } catch (error) {
      console.error('수강 신청 취소 중 오류 발생', error);
    }
  }*/


  /*getRegistrationId(courseId: number): number | null {
    const registration = this.coursesRegistration.find(reg => reg.course_id === courseId);
    return registration ? registration.id : null; // 등록된 ID 반환, 없으면 null 반환
  }*/








  async userInquiry(){



  }

  acceptUser(userId: number) {
    // 유저 수락 로직을 여기에 구현
    console.log(`User ${userId} accepted.`);
  }

  rejectUser(userId: number) {
    // 유저 거절 로직을 여기에 구현
    console.log(`User ${userId} rejected.`);
  }



}
