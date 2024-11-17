import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../services/course/course.service';
import { AuthService } from '../services/auth/auth.service';
import { Role, Registration } from '../models/enums/role.enums';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseRegistration } from '../models/course/courses/course-registation-response.interface';

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
      if (!this.authService.isAuthenticated()) {
        await this.router.navigate(['/loginpage']);
        return false;
      }

      const userRole = this.authService.getUserRole();
      console.log('Current user role:', userRole);

      switch (userRole) {
        case Role.ADMIN:
          return this.handleAdminNavigation(state);
        case Role.INSTRUCTOR:
          return this.handleInstructorNavigation(state);
        case Role.STUDENT:
          return this.handleStudentNavigation(route, state);
        default:
          await this.router.navigate(['/loginpage']);
          return false;
      }
    } catch (error) {
      console.error('Navigation guard error:', error);
      await this.router.navigate(['/classnone']);
      return false;
    }
  }

  private handleAdminNavigation(state: RouterStateSnapshot): boolean {
    if (state.url.includes('/classsignup')) {
      return true;
    }
    this.router.navigate(['/classsignup']);
    return false;
  }

  private handleInstructorNavigation(state: RouterStateSnapshot): boolean {
    if (state.url.includes('/classinstructor') || 
        state.url.includes('/classsignup') || 
        state.url.includes('/classnone')) {
      return true;
    }
    this.router.navigate(['/classinstructor']);
    return false;
  }

  private async handleStudentNavigation(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (state.url.includes('/classinstructor')) {
      await this.router.navigate(['/classnone']);
      return false;
    }

    if (state.url.includes('/classsignup') || state.url.includes('/classnone')) {
      return true;
    }

    if (state.url.includes('/classmy')) {
      const courseId = route.paramMap.get('course_id');
      if (!courseId || courseId === '0') {
        console.log('Invalid courseId, redirecting to classnone');
        await this.router.navigate(['/classnone']);
        return false;
      }

      const isApproved = await this.checkApprovalStatus(Number(courseId));
      if (!isApproved) {
        await this.router.navigate(['/classnone']);
        return false;
      }
      return true;
    }

    await this.router.navigate(['/classnone']);
    return false;
  }

  private async checkApprovalStatus(courseId: number): Promise<boolean> {
    try {
        if (!courseId || courseId === 0) {
            console.log('Invalid courseId');
            return false;
        }

        const userId = this.authService.getUserId();
        if (!userId) {
            console.log('No user ID found');
            return false;
        }

        const response = await firstValueFrom(
            this.courseService.getAllinqueryUsers(courseId)
        );

        console.log('API Response:', response);

        if (!response?.data?.length) {
            console.log('No data in response');
            return false;
        }

        const registrations = response.data[0]?.course_registration || [];

        if (!registrations.length) {
            console.log('No registrations found');
            return false;
        }

        const hasApproved = registrations.some((reg: CourseRegistration) => 
            reg.status === Registration.APPROVED && 
            reg.applicant?.id === userId 
        );

        console.log('Approval status:', hasApproved);
        return hasApproved;

    } catch (error) {
        console.error('Approval check failed:', error);
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 401:
                    await this.router.navigate(['/loginpage']);
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
}