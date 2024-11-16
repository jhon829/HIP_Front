import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgForOf } from "@angular/common";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course/course.service';
import { firstValueFrom } from 'rxjs';
import { Registration } from '../../models/enums/role.enums';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [
    IonicModule,
    RouterLink,
    NgForOf,
    RouterLinkActive,
    CommonModule,
  ],
  providers: [CourseService],
  standalone: true
})
export class SidemenuComponent implements OnInit {
  classesVisible = false;
  projectsVisible = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
    }
  }

  async navigateTo(page: string) {
    if (page === 'classmy') {
      await this.handleClassMyNavigation();
    } else {
      await this.router.navigate([page]);
    }
  }

  private async handleClassMyNavigation() {
    this.isLoading = true;
    
    try {
      const coursesResponse = await firstValueFrom(this.courseService.getAllCourses());
      
      if (!coursesResponse.data?.length) {
        this.errorMessage = '수강 가능한 강의가 없습니다.';
        return;
      }
      
      for (const course of coursesResponse.data) {
        try {
          const registrationResponse = await firstValueFrom(
            this.courseService.getAllinqueryUsers(course.course_id)
          );

          // null 체크 추가
          if (!registrationResponse?.data) {
            console.log(`No registration data for course ${course.course_id}`);
            continue;
          }

          // course_registration 배열 체크 추가
          const hasApprovedCourse = registrationResponse.data.some(registration => 
            registration?.course_registration?.some(
              reg => reg?.status === Registration.APPROVED
            )
          );

          if (hasApprovedCourse) {
            await this.router.navigate(['classmy', course.course_id]);
            return;
          }
        } catch (error) {
          console.error(`Error checking course ${course.course_id}:`, error);
          continue;  // 한 강의 체크 실패시 다음 강의로 진행
        }
      }

      this.errorMessage = '승인된 수강신청이 없습니다.';
      
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = '데이터 로드 중 오류가 발생했습니다.';
    } finally {
      this.isLoading = false;
    }
}

  toggleClasses() {
    this.classesVisible = !this.classesVisible;
  }

  toggleProjects() {
    this.projectsVisible = !this.projectsVisible;
  }
}