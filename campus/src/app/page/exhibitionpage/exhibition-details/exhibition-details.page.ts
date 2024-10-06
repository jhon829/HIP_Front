import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
    private router: Router,
    private exhibitionService: ExhibitionService,
    private alertController: AlertController
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
  async deleteExhibition() {
    const alert = await this.alertController.create({
      header: '전시물 삭제',
      message: '정말로 이 전시물을 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '삭제',
          handler: () => {
            if (this.exhibitionId) {
              this.exhibitionService.deleteExhibition(this.exhibitionId.toString()).subscribe(
                () => {
                  console.log('전시물이 성공적으로 삭제되었습니다.');
                  this.router.navigate(['/exhibitions']); // 전시물 목록 페이지로 이동
                },
                (error) => {
                  console.error('전시물 삭제 실패:', error);
                  this.error = '전시물 삭제에 실패했습니다.';
                }
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
