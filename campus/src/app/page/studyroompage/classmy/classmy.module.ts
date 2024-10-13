import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassmyPageRoutingModule } from './classmy-routing.module';

import { ClassmyPage } from './classmy.page';
import {SidemenuComponent} from "../../../component/sidemenucomponent/sidemenu.component";
import {CourseTitleComponent} from "../../../component/course-title/course-title.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassmyPageRoutingModule,
    SidemenuComponent
  ],
  declarations: [ClassmyPage, CourseTitleComponent]
})
export class ClassmyPageModule {}
