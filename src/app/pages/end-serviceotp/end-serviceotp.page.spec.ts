import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EndServiceotpPage } from './end-serviceotp.page';

describe('EndServiceotpPage', () => {
  let component: EndServiceotpPage;
  let fixture: ComponentFixture<EndServiceotpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndServiceotpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EndServiceotpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
