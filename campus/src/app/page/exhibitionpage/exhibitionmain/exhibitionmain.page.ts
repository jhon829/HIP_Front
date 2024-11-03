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

  constructor(
    private router: Router,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit() {
    this.loadExhibitions();
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
}
