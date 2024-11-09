import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectmyPageRoutingModule } from './projectmy-routing.module';

import {SidemenuComponent} from "../../../component/sidemenucomponent/sidemenu.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectmyPageRoutingModule,
    SidemenuComponent
  ],
})
export class ProjectmyPageModule {}
