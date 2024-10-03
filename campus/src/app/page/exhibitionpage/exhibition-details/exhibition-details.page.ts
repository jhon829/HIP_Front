import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExhibitionService } from '../../../services/exhibition/exhibitionservice.service';

@Component({
  selector: 'app-exhibition-details',
  templateUrl: './exhibition-details.page.html',
  styleUrls: ['./exhibition-details.page.scss'],
})
export class ExhibitionDetailsPage implements OnInit {
  exhibitionId: string | null = null;
  exhibitionDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit() {
    this.exhibitionId = this.route.snapshot.paramMap.get('id');
    this.loadExhibitionDetails();
  }

  loadExhibitionDetails() {
    if (this.exhibitionId) {
      this.exhibitionService.getExhibition(this.exhibitionId).subscribe(
        (data) => {
          this.exhibitionDetails = data;
        },
        (error) => {
          console.error('전시관 상세 정보 로딩 실패:', error);
        }
      );
    }
  }
}
