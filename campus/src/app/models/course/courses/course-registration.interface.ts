import { Registration } from '../../enums/role.enums';

export interface CourseRegistrationRequestDto {
  //generation:number;
  course_reporting_date: string;
  course_registration_status: Registration; // 강의 등록 상태 (열거형)
}
