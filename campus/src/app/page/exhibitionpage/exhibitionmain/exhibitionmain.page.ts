import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExhibitionService } from "../../../services/exhibition/exhibitionservice.service";

@Component({
  selector: 'app-exhibitionmain',
  templateUrl: './exhibitionmain.page.html',
  styleUrls: ['./exhibitionmain.page.scss'],
})
export class ExhibitionmainPage implements OnInit {
  exhibitions: any[] = [];
  accordionTitle: string = '최신순';
  isOpen: boolean = true;
  imageUrl: string | null = null; // 이미지 URL을 저장할 변수

  constructor(
    private router: Router,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit() {
    this.loadExhibitions();
    this.loadImage('path/');
  }

  loadExhibitions() {
    this.exhibitionService.getExhibitions().subscribe(
      (response: any) => {
        this.exhibitions = response.exhibitions;
      },
      (error) => {
        console.error('전시관 데이터 로딩 실패:', error);
      }
    );
  }

  navigateToExhibition(exhibitionId: number) {
    this.router.navigate(['/exhibition', exhibitionId]);
  }

  changeTitle(newTitle: string) {
    this.accordionTitle = newTitle;
    this.isOpen = !this.isOpen;
  }

  navigateToExhibitionCreate() {
    this.router.navigate(['/exhibitioncreate']);
  }

  // 파일 다운로드 로직 구현
    
    downloadFile(filePath: string) {
      this.exhibitionService.getPresignedUrl(filePath).subscribe(
        (response) => {
          const fileUrl = response.url; // presigned URL 획득
          this.triggerDownload(fileUrl); // 다운로드 트리거
        },
        (error) => {
          console.error('URL 요청 실패:', error);
        }
      );
    }
  
    private triggerDownload(url: string) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // 새 탭에서 열기
      link.download = ''; // 다운로드할 파일 이름을 지정할 수 있습니다.
      document.body.appendChild(link);
      link.click(); // 다운로드 실행
      document.body.removeChild(link); // 링크 요소 제거
    }

    loadImage(filePath: string) {
      this.exhibitionService.getPresignedUrl(filePath).subscribe(
        (response) => {
          this.imageUrl = response.url; // presigned URL 저장
        },
        (error) => {
          console.error('URL 요청 실패:', error);
        }
      );
    }
    
}
