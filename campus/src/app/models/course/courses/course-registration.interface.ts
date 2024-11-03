import { Registration } from '../../enums/role.enums';

export interface CreateCourseRegistrationDto {
  course_reporting_date: String;
  course_registration_status: Registration; // 강의 등록 상태 (열거형)
}
