import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SidemenuComponent } from './component/sidemenucomponent/sidemenu.component';
import {TopBarComponent} from "./component/top-bar/top-bar.component";



// @ts-ignore
const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'top-bar', component: TopBarComponent
  },
  {
    path: 'sidemenu', component: SidemenuComponent
  },

  {
    path: 'main',
    loadChildren: () => import('./page/mainpage/firstpage/firstpage.module').then(m => m.FirstpagePageModule)
  },
  {
    path: 'exhibitionmain',
    loadChildren: () => import('./page/exhibitionpage/exhibitionmain/exhibitionmain.module').then(m => m.ExhibitionmainPageModule)
  },
  {
    path: 'loginpage',
    loadChildren: () => import('./page/mainpage/loginpage/loginpage.module').then(m => m.LoginpagePageModule)
  },
  {
    path: 'joinpage',
    loadChildren: () => import('./page/mainpage/joinpage/joinpage.module').then(m => m.JoinpagePageModule)
  },
  {
    path: 'exhibition-details',
    loadChildren: () => import('./page/exhibitionpage/exhibition-details/exhibition-details.module').then(m => m.ExhibitionDetailsPageModule)
  },
  {
    path: 'exhibition/:id', loadChildren: () => import('./page/exhibitionpage/exhibition-details/exhibition-details.module').then(m => m.ExhibitionDetailsPageModule)
  },
// 사이드 메뉴 경로
  {
    path: 'studyroom',
    loadChildren: () => import('./page/studyroompage/studyroom/studyroom.module').then(m => m.StudyroomPageModule)
  },
  // {
  //   path: 'page',
  //   loadChildren: () => import('./page/page.module').then( m => m.PagePageModule)
  // },
  {
    path: 'exhibitioncreate',
    loadChildren: () => import('./page/exhibitionpage/exhibitioncreate/exhibitioncreate.module').then(m => m.ExhibitioncreatePageModule)
  },
  {
    path: 'classsignup',
    loadChildren: () => import('./page/studyroompage/classsignup/classsignup.module').then(m => m.ClasssignupPageModule)
  },
  {
    path: 'classmy',
    loadChildren: () => import('./page/studyroompage/classmy/classmy.module').then(m => m.ClassmyPageModule)
  },
  {
    path: 'classnone',
    loadChildren: () => import('./page/studyroompage/classnone/classnone.module').then(m => m.ClassnonePageModule)
  },
  {
    path: 'projectsearch',
    loadChildren: () => import('./page/studyroompage/projectsearch/projectsearch.module').then(m => m.ProjectsearchPageModule)
  },
  {
    path: 'projectmy',
    loadChildren: () => import('./page/studyroompage/projectmy/projectmy.module').then(m => m.ProjectmyPageModule)
  },
  {
    path: 'introduce-metaverse',
    loadChildren: () => import('./page/mainpage/introduce-metaverse/introduce-metaverse.module').then(m => m.IntroduceMetaversePageModule)
  },
  {
    path: 'exhibition-update',
    loadChildren: () => import('./page/exhibitionpage/exhibition-update/exhibition-update.module').then( m => m.ExhibitionUpdatePageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
