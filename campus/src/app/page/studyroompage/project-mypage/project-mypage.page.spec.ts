import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectMypagePage } from './project-mypage.page';

describe('ProjectMypagePage', () => {
  let component: ProjectMypagePage;
  let fixture: ComponentFixture<ProjectMypagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMypagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
