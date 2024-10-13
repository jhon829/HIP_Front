import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../../services/course/course.service';
import { CourseResponseDto } from '../../models/course/courses/course-response.interface';
import {ApiResponse} from "../../models/common/api-response.interface";
import { ModalController } from '@ionic/angular';
import {CourseCreateModalComponent} from "../course-create-modal/course-create-modal.component";
import {UpdateCourseModalComponent} from "../update-course-modal/update-course-modal.component";

@Component({
  selector: 'app-course-title',
  templateUrl: './course-title.component.html',
  styleUrls: ['./course-title.component.scss'],
})
export class CourseTitleComponent  implements OnInit {
  courses : CourseResponseDto[] = [];
  course_id: number = 14;  // courseId 저장

  constructor(
    private courseService : CourseService,
    private modalController : ModalController
  ) { }

  ngOnInit() {
    this.loadTitleCourses();
  }

  //코스에 대한 data 반환 : CourseResponseDto
  async loadTitleCourses() {
    try {
      const response: ApiResponse<CourseResponseDto[]> = await firstValueFrom(this.courseService.getOneCourses(this.course_id));
      // response.data가 배열이 아닌 단일 객체일 경우 배열로 변환
      if (!Array.isArray(response.data)) {
        this.courses = [response.data]; // 배열로 변환
      } else {
        this.courses = response.data; // 이미 배열이면 그대로 사용
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }


  // 모달 열기
  openModal(course: CourseResponseDto) {
    this.modalController.create({
      component: UpdateCourseModalComponent,
      cssClass: 'modal',
      componentProps: { course }, // 기존 강의 데이터를 모달에 전달
    }).then(modal => modal.present());
  }



}
