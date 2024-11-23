// import {Component, OnInit} from '@angular/core';
// import {IonicModule} from '@ionic/angular';
// import {RouterLink, RouterLinkActive} from "@angular/router";
// import {CommonModule} from '@angular/common';
// import {ModalController} from '@ionic/angular';
// import {AuthService} from '../../services/auth/auth.service';
// import {JoinModalComponent} from "../join-modal/join-modal.component";

// @Component({
//   selector: 'app-top-bar',
//   templateUrl: './top-bar.component.html',
//   styleUrls: ['./top-bar.component.scss'],
//   standalone: true,
//   imports: [
//     IonicModule,
//     RouterLink,
//     RouterLinkActive,
//     CommonModule,
//   ],
// })
// export class TopBarComponent implements OnInit {
//   isLoggedIn = false;
//   userProfile: any;

//   constructor(
//     private modalController: ModalController,
//     private authService: AuthService,
//   ) {}

//   ngOnInit() {
//     this.authService.isLoggedIn.subscribe(status => {
//       console.log('로그인 상태:', status);
//       this.isLoggedIn = status;  // 로그인 상태가 변경될 때 업데이트
//     });

//   }

//   logout() {
//     this.authService.logout_current();  // 로그아웃 호출
//   }

//   async openModal() {
//     const modal = await this.modalController.create({
//       component: JoinModalComponent,
//       cssClass: "modal"
//     });

//     return await modal.present();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';
import { JoinModalComponent } from "../join-modal/join-modal.component";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
})
export class TopBarComponent implements OnInit {
  isLoggedIn = false;
  userProfile: any;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(status => {
      console.log('로그인 상태:', status);
      this.isLoggedIn = status; // 로그인 상태가 변경될 때 업데이트
      if (this.isLoggedIn) {
        this.userProfile = this.authService.getUserProfile(); // 사용자 정보 가져오기
        console.log(this.userProfile)
      } else {
        this.userProfile = null; // 로그아웃 시 사용자 정보 초기화
      }
    });
  }

  logout() {
    this.authService.logout_current(); // 로그아웃 호출
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: JoinModalComponent,
      cssClass: "modal"
    });

    return await modal.present();
  }
}
