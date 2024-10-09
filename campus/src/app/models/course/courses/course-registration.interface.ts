import { Registration } from '../../enums/role.enums';

export interface CreateCourseRegistrationDto {
  course_reporting_date: string; // 강의 보고 날짜 (ISO 8601 형식)
  course_registration_status: Registration; // 강의 등록 상태 (열거형)
  //courseId:number;
}
