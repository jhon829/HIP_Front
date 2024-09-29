import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CourseCreateModalComponent } from '../../component/course-create-modal/course-create-modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // HttpHeaders 추가
import { CourseService } from '../../services/course.service'; // CourseService 가져오기
import { firstValueFrom } from 'rxjs'; // firstValueFrom 가져오기
import { CourseResponse } from '../../services/course-response.interface'; // 인터페이스 경로 수정


@Component({
  selector: 'app-classsignup',
  templateUrl: './classsignup.page.html',
  styleUrls: ['./classsignup.page.scss'],
})
export class ClasssignupPage implements OnInit {
  courses: any[] = []; // 가져온 강의 정보를 저장할 배열

  constructor(
    private modalController: ModalController,
    private courseService: CourseService // 서비스 주입
  ) {}

  ngOnInit() {
    this.loadCourses(); // 컴포넌트가 초기화될 때 강의 목록을 불러옴
  }

  async loadCourses() {
    try {
      const response: CourseResponse = await firstValueFrom(this.courseService.getCourses());
      this.courses = response.data; // response.data에서 배열 추출
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }



  async openModal() {
    const modal = await this.modalController.create({
      component: CourseCreateModalComponent,
      cssClass: 'modal',
    });

    return await modal.present();
  }
}
