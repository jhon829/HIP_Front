import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/course/video.service';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CourseService } from 'src/app/services/course/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoResponseData } from 'src/app/models/course/video/video-response.interface';
import { ApiResponse } from 'src/app/models/common/api-response.interface';

  @Component({
    selector: 'app-video-stream',
    templateUrl: './video-stream.component.html',
    styleUrls: ['./video-stream.component.scss'],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ],
    providers: [CourseService],
    standalone: true
  })

  export class VideoStreamComponent implements OnInit {
    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    
    courseId: number = 0;
    videoTopicId: number = 0;
    videoId: number = 0;
    videoUrl: string = '';
    isPlaying: boolean = false;
    isMuted: boolean = false;
    volume: number = 1;
    isLoading: boolean = true;
    errorMessage: string = '';

    constructor(
      private route: ActivatedRoute,
      private videoService: VideoService
    ) {}

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        if (params['state']) {
          // base64 디코딩하여 state 객체 복원
          const state = JSON.parse(atob(params['state']));
          this.courseId = state.courseId;
          console.log('courseId', this.courseId);
          this.videoTopicId = state.videoTopicId;
          console.log('videoTopicId', this.videoTopicId);
          this.videoId = state.videoId;
          console.log('videoId', this.videoId);
        }
        if (isNaN(this.courseId) || isNaN(this.videoTopicId) || isNaN(this.videoId)) {
          throw new Error('Invalid ID parameters');
      }

      this.loadVideo();
    })
    }

    async loadVideo() {
      try {
        this.isLoading = true;
        const response: ApiResponse<VideoResponseData> = await firstValueFrom(
          this.videoService.streamVideo(
            this.courseId,
            this.videoTopicId,
            this.videoId
          )
        );

        console.log('응답 전체 구조:', JSON.stringify(response, null, 2));
        console.log('응답의 type:', typeof response);
        console.log('응답의 keys:', Object.keys(response));
        console.log('status 존재 여부:', 'status' in response);
        console.log('data 존재 여부:', 'data' in response);
        console.log('message 존재 여부:', 'message' in response);
        
        if (response.data?.url) {
          this.videoUrl = response.data.url;
          // 비디오 로드 후 자동 재생 (선택사항)
          setTimeout(() => {
            if (this.videoPlayer?.nativeElement) {
              this.videoPlayer.nativeElement.play()
                .catch(err => console.log('자동재생 실패:', err));
            }
          }, 0);
        } else {
          this.errorMessage = '비디오 URL을 받아오지 못했습니다.';
        }
      } catch (error) {
        console.error('Error loading video:', error);
        this.errorMessage = '비디오를 로드하는 중 오류가 발생했습니다.';
      } finally {
        this.isLoading = false;
      }
    }

    onPlay() {
      this.isPlaying = true;
    }

    onPause() {
      this.isPlaying = false;
    }

    togglePlay() {
      const video = this.videoPlayer.nativeElement;
      if (this.isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }

    toggleMute() {
      const video = this.videoPlayer.nativeElement;
      video.muted = !video.muted;
      this.isMuted = video.muted;
    }

    adjustVolume(event: Event) {
      const input = event.target as HTMLInputElement;
      const video = this.videoPlayer.nativeElement;
      this.volume = parseFloat(input.value);
      video.volume = this.volume;
    }

    changeQuality(event: Event) {
      const select = event.target as HTMLSelectElement;
      // 여기에 비디오 품질 변경 로직 구현
      console.log(`Changed quality to ${select.value}p`);
    }

    onVolumeChange(event: CustomEvent) {
      const value = event.detail.value;
      if (this.videoPlayer?.nativeElement) {
          this.videoPlayer.nativeElement.volume = value;
          this.volume = value;
          
          // 볼륨이 0이면 음소거 상태로 설정
          if (value === 0) {
              this.isMuted = true;
              this.videoPlayer.nativeElement.muted = true;
          } else if (this.isMuted) {
              // 볼륨이 0이 아니고 음소거 상태였다면 음소거 해제
              this.isMuted = false;
              this.videoPlayer.nativeElement.muted = false;
          }
      }
    }
  }
