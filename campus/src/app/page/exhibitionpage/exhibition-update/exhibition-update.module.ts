import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExhibitionUpdatePageRoutingModule } from './exhibition-update-routing.module';

import { ExhibitionUpdatePage } from './exhibition-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExhibitionUpdatePageRoutingModule
  ],
  declarations: [ExhibitionUpdatePage]
})
export class ExhibitionUpdatePageModule {}
