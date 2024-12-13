import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CourseRegistrationResponseData } from 'src/app/models/course/courses/course-registation-response.interface';
import { CourseRegistrationRequestData } from 'src/app/models/course/courses/course-registration-request.interface';
import { CourseResponseData } from 'src/app/models/course/courses/course-response.interface';
import { Registration, Role } from 'src/app/models/enums/role.enums';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
    selector: 'app-registration-admin',
    templateUrl: './registration-admin.page.html',
    styleUrls: ['./registration-admin.page.scss'],
})
export class RegistrationAdminPage implements OnInit {
    userRole: string = '';
    coursesList: CourseResponseData[] = [];
    CourseRegistrationResponseData: { [courseId: number]: CourseRegistrationResponseData[] } = {};
    
    constructor(
        private router: Router,
        private courseService: CourseService
    ) { }

    async ngOnInit() {
        // 사용자 역할 확인
        this.userRole = localStorage.getItem('Role') || '';
        const courseId = Number(localStorage.getItem('courseId'));  // 예시: localStorage에서 courseId 가져오기
        const userId = Number(localStorage.getItem('userId'));      // 예시: localStorage에서 userId 가져오기
        await this.loadInstructorCourses();
        // courseId와 userId가 존재할 때만 courseinqueryUser 호출
        if (courseId && userId) {
        this.courseinqueryUser(courseId, userId);
        }
    }

    // 강의 목록 로드
    async loadInstructorCourses() {
        try {
        const response = await firstValueFrom(
            this.courseService.getAllCourses()  // 또는 getInstructorCourses() API가 있다면 사용
        );
        // 현재 강사의 강의만 필터링 (강사 ID로 필터링하는 로직 필요)
        this.coursesList = response.data;
        console.log('강사 강의 목록:', this.coursesList);
        } catch (error) {
        console.error('강의 목록 로드 중 오류 발생:', error);
        }
    }

    // 특정 강의의 classmy 페이지로 이동
    async enterCourse(courseId: number) {
        // const course = this.coursesList.find(c => c.course_id === courseId);
        // if (course) {
        //     // 선택한 courseId만 courseIds 배열에 저장
        //     localStorage.setItem('courseIds', JSON.stringify([courseId]));
        // }
        // 해당 강의의 classmy 페이지로 라우팅
        await this.router.navigate(['/classmy', courseId]);
    }

    // 강의 신청 유저 조회하기
    async courseinqueryUser(courseId: number, userId: number) {
        try {
            const response: ApiResponse<CourseRegistrationResponseData> = await firstValueFrom(
                this.courseService.getRegistration(courseId, userId)
            );
        
            if (response?.data) {        
                // applicant와 currentCourse가 존재하는지 먼저 확인
                const applicant = response.data.user;
                const currentCourse = response.data.course;
            
                if (!applicant || !currentCourse) {
                    console.error('Required data is missing');
                    return;
                }
        
                // 필수 데이터가 있는 경우에만 매핑 진행
                const mappedRegistration: CourseRegistrationResponseData = {
                    course_registration_id: response.data.course_registration_id,
                    course_registration_status: response.data.course_registration_status,
                    course_reporting_date: new Date(response.data.course_reporting_date),
                    user: {
                        user_id: applicant.user_id,
                        id: applicant.id || '',
                        user_name: applicant.user_name || '',
                        email: applicant.email || '',
                        user_role: applicant.user_role || ''
                    },
                    course: {
                        course_id: currentCourse.course_id,
                        course_title: currentCourse.course_title || '',
                        description: currentCourse.description || '',
                        instructor_name: currentCourse.instructor_name || '',
                        course_notice: currentCourse.course_notice || '',
                        generation: currentCourse.generation || ''
                    }
                };
                this.CourseRegistrationResponseData[courseId] = [mappedRegistration];
                console.log('Mapped registration data:', this.CourseRegistrationResponseData[courseId]);
            }
        } catch (error) {
            console.error(`Error loading registrations for course ${courseId}`, error);
            alert('강의 등록 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }
    
    // 수락 버튼, course_registration에 접근해서 status만 update
    async approveButton(courseId: number, registrationId: number) {
        try{
            const courseStatus = Registration.APPROVED;
            const registrationData: CourseRegistrationRequestData = {
                course_registration_status: courseStatus
            };
            const response = await firstValueFrom(
                this.courseService.updateRegistration(courseId, registrationId, registrationData)
            );

            console.log('back-end message:', response.message);
            alert(response.message);  // 백엔드에서 보내준 메시지 사용

        } catch (error) {
            console.error('강의 상태 수정 중 오류 발생:', error);
            let errorMessage = '강의 상태 수정 중 오류가 발생했습니다.';
    
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 400:
                        errorMessage = '잘못된 요청입니다.';
                        break;
                    case 401:
                        errorMessage = 'auth 오류.';
                        break;
                    case 409:
                        errorMessage = '이미 수정한 강의입니다.';
                        break;
                    default:
                        errorMessage = '서버 오류가 발생했습니다.';
                }
            }
    
            alert(errorMessage);
        }
    }

    // 거절 버튼, course_registration에 접근해서 status만 update

}
