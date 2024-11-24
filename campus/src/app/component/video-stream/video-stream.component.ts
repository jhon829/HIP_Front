import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/course/video.service';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CourseService } from 'src/app/services/course/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

    constructor(
      private route: ActivatedRoute,
      private videoService: VideoService
    ) {}

    ngOnInit() {
      // URL에서 모든 필요한 파라미터 가져오기
      this.route.params.subscribe(params => {
        this.courseId = Number(params['courseId']);
        this.videoTopicId = Number(params['videoTopicId']);
        this.videoId = Number(params['videoId']);
        this.loadVideo();
      });
    }

    async loadVideo() {
      try {
        const response = await firstValueFrom(
          this.videoService.streamVideo(
            this.courseId,
            this.videoTopicId,
            this.videoId
          )
        );
        this.videoUrl = response.data.url;
      } catch (error) {
        console.error('Error loading video:', error);
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
  