import { Component } from '@angular/core';
import { ExhibitionService } from "../../services/exhibitionservice.service";
import { tap } from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-exhibitioncreate',
  templateUrl: './exhibitioncreate.page.html',
  styleUrls: ['./exhibitioncreate.page.scss'],
})
export class ExhibitioncreatePage {
  projectName: string = '';
  teamName: string = '';
  course: string = '';
  thumbnail: File | null = null;
  thumbnailPreview: string | null = null; // 미리보기 URL
  introduce: string = '';
  introductions: string[] = []; // Introduce 문장을 저장할 배열
  memberName: string = '';
  memberImage: File | null = null;
  members: { name: string, image: string }[] = []; // Member를 저장할 배열
  outputImagesList: string[] = []; // Output 이미지 URL을 저장할 배열
  outputImages: FileList | null = null;
  outputVideo: File | null = null;
  outputVideoPreview: string | null = null; // 영상 미리보기 URL

  constructor(private exhibitionService: ExhibitionService) {}

  addIntroduce() {
    if (this.introduce) {
      this.introductions.push(this.introduce);
      this.introduce = ''; // 입력 필드 초기화
    }
  }

  removeIntroduce(index: number) {
    this.introductions.splice(index, 1); // 해당 인덱스의 문장 삭제
  }

  addMember() {
    if (this.memberName && this.memberImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.members.push({ name: this.memberName, image: e.target.result as string });
          this.memberName = '';
          this.memberImage = null;
        }
      };
      reader.readAsDataURL(this.memberImage);
    }
  }

  removeMember(index: number) {
    this.members.splice(index, 1); // 해당 인덱스의 멤버 삭제
  }

  addOutputImage() {
    if (this.outputImages && this.outputImages.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.outputImagesList.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(this.outputImages[0]);
      this.outputImages = null;
    }
  }

  removeOutputImage(index: number) {
    this.outputImagesList.splice(index, 1); // 해당 인덱스의 출력 이미지 삭제
  }

  onOutputImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.outputImages = target.files; // 여러 파일을 선택할 수 있도록
    }
  }

  onMemberImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.memberImage = target.files[0]; // memberImage 파일 설정
    }
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.thumbnail = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.thumbnailPreview = e.target.result as string;
        }
      };
      reader.readAsDataURL(this.thumbnail);
    }
  }

  onOutputVideoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.outputVideo = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.outputVideoPreview = e.target.result as string;
        }
      };
      reader.readAsDataURL(this.outputVideo);
    }
  }

  onSubmit() {
    // 유효성 검사
    if (this.introductions.length < 1 || this.introductions.length > 5) {
      alert('Introduce 문장은 1~5개 사이여야 합니다.');
      return;
    }

    if (this.members.length < 1 || this.members.length > 7) {
      alert('Member는 1~7명이어야 합니다.');
      return;
    }

    if (this.outputImagesList.length < 1 || this.outputImagesList.length > 3) {
      alert('Output에서 사용할 사진은 1~3개이어야 합니다.');
      return;
    }
    const exhibitionData = new FormData();
    exhibitionData.append('projectName', this.projectName);
    exhibitionData.append('teamName', this.teamName);
    exhibitionData.append('course', this.course);
    if (this.thumbnail) {
      exhibitionData.append('thumbnail', this.thumbnail);
    }

    const introductionsData = new FormData();
    this.introductions.forEach((intro, index) => {
      introductionsData.append(`introductions[${index}]`, intro);
    });

    const membersData = new FormData();
    this.members.forEach((member, index) => {
      membersData.append(`members[${index}][name]`, member.name);
      membersData.append(`members[${index}][image]`, this.dataURLtoFile(member.image, `member_${index}.jpg`));
    });

    const outputData = new FormData();
    if (this.outputImages) {
      Array.from(this.outputImages).forEach((image, index) => {
        outputData.append(`outputImages[${index}]`, image);
      });
    }
    if (this.outputVideo) {
      outputData.append('outputVideo', this.outputVideo);
    }

    const requests: Observable<any>[] = [
      this.exhibitionService.saveExhibitionData(exhibitionData),
      this.exhibitionService.saveIntroductions(introductionsData),
      this.exhibitionService.saveMembers(membersData),
      this.exhibitionService.saveOutputs(outputData)
    ];

    // 모든 요청을 병렬로 실행
    forkJoin(requests).subscribe({
      next: (responses) => {
        console.log('모든 데이터 전송 성공:', responses);
        // 성공 시 추가 동작 (예: 성공 알림)
      },
      error: (error) => {
        console.error('데이터 전송 실패:', error);
        // 실패 시 추가 동작 (예: 실패 알림)
      }
    });

  }
  // Data URL을 File 객체로 변환하는 헬퍼 함수
  dataURLtoFile(dataurl: string, filename: string): File {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/);
    if (mime && mime[1]) {
      let bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime[1]});
    }
    throw new Error('Invalid data URL');
  }

}
