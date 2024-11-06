import { Component, OnInit } from '@angular/core';
import { VideoService } from './video.service'; // 서비스 임포트

interface Video {
  file: File; // 파일 객체 추가
  title: string;
}

@Component({
  selector: 'app-video-create-modal',
  templateUrl: './video-create-modal.component.html',
  styleUrls: ['./video-create-modal.component.scss'],
})
export class VideoCreateModalComponent implements OnInit {
  videos: Video[] = [];
  courseId: number = 0; // 초기값은 빈 문자열
  videoTopicId: number = 0; // 초기값은 빈 문자열
  
  constructor(
    private videoService: VideoService
  ) {}

  ngOnInit() {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const video: Video = {
        file: file, // 파일 객체를 저장
        title: '영상 제목 ' + (this.videos.length + 1),
      };
      this.videos.push(video); // 비디오 목록에 추가
      console.log(this.videos); // 콘솔에 현재 비디오 목록 출력
    }
  }

  uploadVideo(video: Video) { // Video 타입으로 변경
    this.videoService.uploadVideo(this.courseId, this.videoTopicId, video.file).subscribe(
      response => {
        console.log('업로드 성공:', response);
      },
      error => {
        console.error('업로드 실패:', error);
      }
    );
  }

  onUpload() {
    if (this.videos.length > 0) {
      const video = this.videos[this.videos.length - 1]; // 마지막으로 추가된 비디오 객체
      this.uploadVideo(video); // 파일 업로드
    } else {
      console.error('비디오 파일이 없습니다.');
    }
  }
}
