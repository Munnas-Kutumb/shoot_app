import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SubscriptionProcessPage } from "./subscription-process.page";

describe("ProfileApprovalPage", () => {
  let component: SubscriptionProcessPage;
  let fixture: ComponentFixture<SubscriptionProcessPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubscriptionProcessPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SubscriptionProcessPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
