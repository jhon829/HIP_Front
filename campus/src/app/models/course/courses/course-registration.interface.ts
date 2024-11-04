// registration-status.interface.ts
import { Registration } from '../../enums/role.enums';

export interface AdminResponseCourseRegistrationDto {
  course_registration_status: Registration;
  course_reporting_date: Date;
  applicant: ApplicantInfo;
  currentCourse: CurrentCourseInfo;
}

export interface ApplicantInfo {
  user_name: string;
  id: string;
  email: string;
  user_role: string;
}

export interface CurrentCourseInfo {
  course_id: string;
  course_title: string;
}
