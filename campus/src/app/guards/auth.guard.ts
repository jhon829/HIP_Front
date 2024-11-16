import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../services/course/course.service';
import { AuthService } from '../services/auth/auth.service';
import { ApiResponse } from '../models/common/api-response.interface';
import { CourseWithCourseRegistrationResponseData } from '../models/course/courses/course-with-courseregistration-resoinse.interface';
import { Role, Registration } from '../models/enums/role.enums';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      // 로그인 체크
      if (!this.isLoggedIn()) {
        this.router.navigate(['/loginpage']);
        return false;
      }

      const userRole = await this.getUserRole();

      // 관리자 권한 처리
      if (this.isAdmin(userRole)) {
        if (state.url.includes('/classsignup')) {
          return true;  // classsignup만 접근 가능
        }
        // 다른 모든 페이지는 classsignup으로 리디렉션
        this.router.navigate(['/classsignup']);
        return false;
      }

      // 강사 권한 처리
      if (this.isInstructor(userRole)) {
        // classinstructor, classsignup, classnone 접근 허용
        if (state.url.includes('/classinstructor') || 
            state.url.includes('/classsignup') || 
            state.url.includes('/classnone')) {
          return true;
        }

        // classmy 페이지 처리
        if (state.url.includes('/classmy')) {
          const courseId = route.paramMap.get('course_id');
          if (!courseId || courseId === '0') {
            this.router.navigate(['/classnone']);
            return false;
          }

          const isApproved = await this.checkApprovalStatus(Number(courseId));
          if (!isApproved) {
            this.router.navigate(['/classnone']);
            return false;
          }
          // 승인된 경우 classinstructor로 리디렉션
          this.router.navigate(['/classinstructor']);
          return false;
        }
      }

      // 학생 권한 처리
      if (this.isStudent(userRole)) {
        // classinstructor 접근 불가
        if (state.url.includes('/classinstructor')) {
          return false;
        }

        // classsignup, classnone 접근 허용
        if (state.url.includes('/classsignup') || 
            state.url.includes('/classnone')) {
          return true;
        }

        // classmy 페이지 처리
        if (state.url.includes('/classmy')) {
          const courseId = route.paramMap.get('course_id');
          if (!courseId || courseId === '0') {
            this.router.navigate(['/classnone']);
            return false;
          }

          const isApproved = await this.checkApprovalStatus(Number(courseId));
          if (!isApproved) {
            this.router.navigate(['/classnone']);
            return false;
          }
          return true;  // 승인된 경우 classmy 접근 허용
        }
      }

      return false;  // 기본적으로 접근 거부

    } catch (error) {
      console.error('Navigation guard error:', error);
      return false;
    }
  }

  private isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  private async getUserRole(): Promise<string> {
    try {
      const role = localStorage.getItem('Role');
      return role || Role.STUDENT;  // 기본값으로 STUDENT 설정
    } catch (error) {
      console.error('Error getting user role:', error);
      return Role.STUDENT;
    }
  }

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

      console.log('Current user registrations:', currentUserRegistrations);

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

  private isAdmin(role: string): boolean {
    return role === Role.ADMIN;
  }

  private isInstructor(role: string): boolean {
    return role === Role.INSTRUCTOR;
  }

  private isStudent(role: string): boolean {
    return role === Role.STUDENT;
  }
}