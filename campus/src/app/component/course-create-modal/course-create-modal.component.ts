import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../services/course/course.service'; // 서비스 import
import { AlertController } from '@ionic/angular'; // AlertController import
import { firstValueFrom } from 'rxjs'; // firstValueFrom import
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-course-create-modal',
  templateUrl: './course-create-modal.component.html',
  styleUrls: ['./course-create-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,  // 추가된 부분
  ]
})
export class CourseCreateModalComponent implements OnInit {
  courseForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService, // 서비스 주입
    private alertController: AlertController // AlertController 주입
  ) {
    this.courseForm = this.formBuilder.group({
      course_title: ['', Validators.required],
      instructor_name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;

      try {
        // firstValueFrom을 사용하여 Observable 처리
        const response = await firstValueFrom(this.courseService.createCourse(courseData));
        console.log('Course created successfully:', response);

        // 성공 시 Alert 띄우기
        await this.showAlert('성공', '클래스가 성공적으로 생성되었습니다.');
      } catch (error) {
        console.error('Error creating course:', error);
        // 오류 발생 시 Alert 띄우기
        await this.showAlert('실패', '클래스 생성에 실패했습니다.');
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
