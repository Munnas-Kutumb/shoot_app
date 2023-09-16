import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserSearchPhotographerPage } from './user-search-photographer.page';

describe('UserSearchPhotographerPage', () => {
  let component: UserSearchPhotographerPage;
  let fixture: ComponentFixture<UserSearchPhotographerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSearchPhotographerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchPhotographerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
