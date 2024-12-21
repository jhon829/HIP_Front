import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProjectMyLeftBottomComponent } from './project-my-left-bottom.component';

describe('ProjectMyLeftBottomComponent', () => {
  let component: ProjectMyLeftBottomComponent;
  let fixture: ComponentFixture<ProjectMyLeftBottomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMyLeftBottomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMyLeftBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
