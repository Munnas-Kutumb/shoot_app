import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MContactUsPage } from './m-contact-us.page';

describe('MContactUsPage', () => {
  let component: MContactUsPage;
  let fixture: ComponentFixture<MContactUsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MContactUsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MContactUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
