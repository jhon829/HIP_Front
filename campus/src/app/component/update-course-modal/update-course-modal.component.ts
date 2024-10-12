import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../services/course/course.service'; // 서비스 import
import { AlertController } from '@ionic/angular'; // AlertController import
import { firstValueFrom } from 'rxjs'; // firstValueFrom import
import { IonicModule } from '@ionic/angular'; // IonicModule import
import { CourseResponseDto } from '../../models/course/courses/course-response.interface'; // 강의 데이터 모델 import


@Component({
  selector: 'app-update-course-modal',
  templateUrl: './update-course-modal.component.html',
  styleUrls: ['./update-course-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,          // IonicModule 추가
    ReactiveFormsModule,  // ReactiveFormsModule 추가
  ]
})
export class UpdateCourseModalComponent  implements OnInit {
  @Input() course!: CourseResponseDto; // 모달에 전달된 강의 데이터
  courseForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private alertController: AlertController
  ) {
    this.courseForm = this.formBuilder.group({
      course_title: ['', Validators.required],
      instructor_name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.course) {
      // 전달받은 강의 데이터를 폼에 초기값으로 설정
      this.courseForm.patchValue({
        course_title: this.course.course_title,
        instructor_name: this.course.instructor_name,
        description: this.course.description,
      });
    }
  }

  async onSubmit() {
    if (this.courseForm.valid) {
      const courseData = { ...this.course, ...this.courseForm.value }; // 기존 데이터와 폼 데이터를 병합

      try {
        const response = await firstValueFrom(this.courseService.updateCourse(this.course.course_id, courseData));
        console.log('Course updated successfully:', response);
        await this.showAlert('성공', '클래스가 성공적으로 수정되었습니다.');
      } catch (error) {
        console.error('Error updating course:', error);
        await this.showAlert('실패', '클래스 수정에 실패했습니다.');
      }
    }
  }

  // Alert 생성 메서드
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['확인'],
    });
    await alert.present();
  }
}
