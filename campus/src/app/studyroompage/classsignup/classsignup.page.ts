import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CourseCreateModalComponent} from "../../component/course-create-modal/course-create-modal.component";

@Component({
  selector: 'app-classsignup',
  templateUrl: './classsignup.page.html',
  styleUrls: ['./classsignup.page.scss'],
})
export class ClasssignupPage implements OnInit {

  constructor(private modalController: ModalController,) {

  }

  ngOnInit() {
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CourseCreateModalComponent,
      cssClass: "modal"
    });

    return await modal.present();
  }
}
