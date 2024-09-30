
export interface Course {
  course_id: number;          // 강의 ID
  course_title: string;       // 강의 제목
  description: string;        // 강의 설명
  instructor_name: string;    // 강사 이름
  course_notice: string | null; // 강의 공지사항 (null일 수 있음)
}

export interface CourseResponse {
  message: string;            // 응답 메시지
  data: Course[];             // 강의 데이터 배열
}
