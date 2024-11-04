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
import {AdminResponseCourseRegistrationDto} from "../../../models/course/courses/course-get-admin-registration";
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
  // 클래스의 맨 위에 타입 정의 추가
  AdminResponseCourseRegistration: { [courseId: number]: AdminResponseCourseRegistrationDto[] } = {};
  generations: number[] = [1, 2, 3, 4, 5]; // 가능한 세대 목록
  selectedGeneration: number = 1; // 기본값으로 1세대 선택


  constructor(
    private modalController: ModalController,
    private courseService: CourseService // 서비스 주입
  ) {}

  ngOnInit() {
    const savedGeneration = localStorage.getItem('selectedGeneration');
    if (savedGeneration) {
      this.selectedGeneration = parseInt(savedGeneration, 10);
    }
    this.loadCourses();
    this.loadAllCourseInquiries();
  }

  async loadAllCourseInquiries() {
    for (const course of this.courses) {
      await this.courseinqueryUser(course.course_id);
    }
  }

  getApplicantsForCourse(courseId: number): AdminResponseCourseRegistrationDto[] {
    return (this.AdminResponseCourseRegistration[courseId] || [])
      .filter(registration => registration.currentCourse.generation === this.selectedGeneration);
  }


  onGenerationChange() {
    sessionStorage.setItem('selectedGeneration', this.selectedGeneration.toString());
    this.loadCourses();
  }


  async loadCourses() {
    try {
      const response: ApiResponse<CourseResponseDto[]> = await firstValueFrom(this.courseService.getAllCourses());
      console.log('All courses:', response.data);
      this.courses = response.data.filter(course => {
        console.log(`Comparing course generation ${course.generation} with selected generation ${this.selectedGeneration}`);
        return course.generation == this.selectedGeneration;
      });
      console.log('Filtered courses:', this.courses);
      if (this.courses.length === 0) {
        console.warn('No courses found for the selected generation');
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  //조회하기
  async courseinqueryUser(courseId: number) {

    try {
      const response: ApiResponse<AdminResponseCourseRegistrationDto[]> = await firstValueFrom(
        this.courseService.getAllinqueryUsers(courseId)
      );

      this.AdminResponseCourseRegistration[courseId] = response.data || [];
      console.log(`Loaded registrations for course ${courseId}:`, this.AdminResponseCourseRegistration[courseId]);
    } catch (error) {
      console.error(`Error loading registrations for course ${courseId}`, error);
    }
  }



  async createCourse() {
    const modal = await this.modalController.create({
      component: CourseCreateModalComponent,
      cssClass: 'modal',
      componentProps: {
        selectedGeneration: this.selectedGeneration
      }
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

  //강의신청
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


  acceptApplicant(userId: AdminResponseCourseRegistrationDto) {
    // 유저 수락 로직을 여기에 구현
    console.log(`User ${userId} accepted.`);
  }

  rejectApplicant(userId: AdminResponseCourseRegistrationDto) {
    // 유저 거절 로직을 여기에 구현
    console.log(`User ${userId} rejected.`);
  }



}
