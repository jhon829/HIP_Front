import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExhibitionService } from '../../../services/exhibition/exhibitionservice.service';

@Component({
  selector: 'app-exhibition-details',
  templateUrl: './exhibition-details.page.html',
  styleUrls: ['./exhibition-details.page.scss'],
})
export class ExhibitionDetailsPage implements OnInit {
  cardId: number | null = null;
  exhibitionDetails: any = null;  // cardDetails를 exhibitionDetails로 변경
  introduce: string[] = [];
  members: { name: string; image: string }[] = [];
  outputImages: string[] = [];  // 여러 개의 출력 이미지를 저장하기 위해 배열로 변경
  outputVideo: string = '';  // 비디오 URL을 저장하기 위한 속성 추가
  noneImage: string = '../assets/svg/none-people.svg';

  constructor(
    private route: ActivatedRoute,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit() {
    this.cardId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCardDetails();
  }

  loadCardDetails() {
    if (this.cardId) {
      this.exhibitionService.getExhibitionDetails(this.cardId).subscribe(
        (data) => {
          this.exhibitionDetails = data;
          this.introduce = data.introductions || [];  // introductions로 변경
          this.members = data.members || [];
          this.outputImages = data.outputImages || [];  // outputImages 배열로 변경
          this.outputVideo = data.outputVideo || '';  // outputVideo 추가
        },
        (error) => {
          console.error('전시관 상세 정보 로딩 실패:', error);
        }
      );
    }
  }
}
