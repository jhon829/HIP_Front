import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectMypagePageRoutingModule } from './project-mypage-routing.module';

import { ProjectMypagePage } from './project-mypage.page';
import {SidemenuComponent} from "../../../component/sidemenucomponent/sidemenu.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectMypagePageRoutingModule,
    SidemenuComponent
  ],
  declarations: [ProjectMypagePage]
})
export class ProjectMypagePageModule {}
