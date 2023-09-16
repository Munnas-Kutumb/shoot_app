import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserProductListPage } from './user-product-list.page';

describe('UserProductListPage', () => {
  let component: UserProductListPage;
  let fixture: ComponentFixture<UserProductListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProductListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProductListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
