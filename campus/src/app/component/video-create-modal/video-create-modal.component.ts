import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-create-modal',
  templateUrl: './video-create-modal.component.html',
  styleUrls: ['./video-create-modal.component.scss'],
})
export class VideoCreateModalComponent implements OnInit {
  videos = [
    { fileName: '영상파일.mp4', title: '영상 제목 1' },
    { fileName: '영상파일.mp4', title: '영상 제목 2' },
    { fileName: '영상파일.mp4', title: '영상 제목 3' },
    { fileName: '영상파일.mp4', title: '영상 제목 4' },
  ];

  constructor() {}

  ngOnInit() {}
}
