import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectMypagePage } from './project-mypage.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectMypagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectMypagePageRoutingModule {}
