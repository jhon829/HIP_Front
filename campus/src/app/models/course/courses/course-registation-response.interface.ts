import { UserResponse } from "../../common/user-response";
import { Registration } from "../../enums/role.enums";
import { CourseResponseData } from "./course-response.interface";

export interface CourseRegistration {
    id: number;
    status: Registration;
    date: Date;
    applicant?: UserResponse;
    currentCourse?: CourseResponseData;
}