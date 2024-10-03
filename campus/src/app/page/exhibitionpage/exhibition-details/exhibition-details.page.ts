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
  cardDetails: any = null;
  introduce: string[] = [];
  members: { name: string; image: string }[] = [];
  outputImage: string = '';
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
          this.cardDetails = data;
          this.introduce = data.introduce || [];
          this.members = data.members || [];
          this.outputImage = data.outputImage || '';
        },
        (error) => {
          console.error('전시관 상세 정보 로딩 실패:', error);
        }
      );
    }
  }
}
