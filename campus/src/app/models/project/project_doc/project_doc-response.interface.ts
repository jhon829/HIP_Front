import { FeedbackResponseData } from "../feedback/feedback-response.interface";
import { ProjectResponseData } from "../projects/projects-response.interface";

export interface ProjectDocResponseData {
    project_doc_id: number;
    file_path: string;
    project_doc_title: string;
    project_data: ProjectResponseData;
    feedback_data: FeedbackResponseData[];
}