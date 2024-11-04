import { Registration } from '../../enums/role.enums';
import { UseResponse } from '../../common/use-response'; // UseResponse 경로에 맞게 수정

export interface AdminResponseCourseRegistrationDto {
  course_registration_status: Registration;
  course_reporting_date: Date;
  applicant: UseResponse; // 기존 UseResponse 인터페이스 사용
  currentCourse: CurrentCourseInfo;
}

export interface CurrentCourseInfo {
  course_id: string;
  course_title: string;
}
