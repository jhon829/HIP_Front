import { Registration } from '../../enums/role.enums';
import { UseResponse } from '../../common/use-response';
import { CourseResponseDto } from '../courses/course-response.interface'

export interface AdminResponseCourseRegistrationDto {
  //generation: number;
  //course_id: number;
  course_registration_status: Registration;
  course_reporting_date: Date;
  applicant: UseResponse;
  currentCourse: CourseResponseDto;
}
