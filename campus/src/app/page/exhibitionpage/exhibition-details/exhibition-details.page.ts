import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExhibitionService } from '../../../services/exhibition/exhibitionservice.service';

@Component({
  selector: 'app-exhibition-details',
  templateUrl: './exhibition-details.page.html',
  styleUrls: ['./exhibition-details.page.scss'],
})
export class ExhibitionDetailsPage implements OnInit {
  exhibitionId: number | null = null;
  exhibitionDetails: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit() {
    this.exhibitionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExhibitionDetails();
  }

  loadExhibitionDetails() {
    if (this.exhibitionId) {
      this.isLoading = true;
      this.exhibitionService.getAllExhibitionDetails(this.exhibitionId).subscribe(
        (data) => {
          this.exhibitionDetails = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('전시관 상세 정보 로딩 실패:', error);
          this.error = '전시관 정보를 불러오는 데 실패했습니다.';
          this.isLoading = false;
        }
      );
    }
  }
}
