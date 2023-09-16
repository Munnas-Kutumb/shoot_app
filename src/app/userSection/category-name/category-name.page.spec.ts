import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryNamePage } from './category-name.page';

describe('CategoryNamePage', () => {
  let component: CategoryNamePage;
  let fixture: ComponentFixture<CategoryNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
