import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserAboutusPage } from './user-aboutus.page';

describe('UserAboutusPage', () => {
  let component: UserAboutusPage;
  let fixture: ComponentFixture<UserAboutusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAboutusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserAboutusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
