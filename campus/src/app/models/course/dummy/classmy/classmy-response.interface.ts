import { LectureItem } from "./lecture_item-response.interface";
import { VideoTopicRequestData } from "../../video_topic/video_topic-request.interface";

export interface ClassmyResponseData {
    activeSection: 'lecture' | 'material'; // union type으로 명확한 값 정의
    VideoTopics: VideoTopicRequestData[];
    lectureItems: LectureItem[];
    isEmptyState: boolean;
  }