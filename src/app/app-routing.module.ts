import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("../app/pages/gif/gif.module").then((m) => m.GifPageModule),
  },
  {
    path: "splash",
    loadChildren: () =>
      import("../app/pages/slides/slides.module").then(
        (m) => m.SlidesPageModule
      ),
  },
  {
    path: "tab",
    loadChildren: () =>
      import("../app/pages/tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "slides",
    loadChildren: () =>
      import("./pages/slides/slides.module").then((m) => m.SlidesPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/profile/profile.module").then((m) => m.ProfilePageModule),
  },
  {
    path: "bookings",
    loadChildren: () =>
      import("./pages/bookings/bookings.module").then(
        (m) => m.BookingsPageModule
      ),
  },
  {
    path: "portfolio",
    loadChildren: () =>
      import("./pages/portfolio/portfolio.module").then(
        (m) => m.PortfolioPageModule
      ),
  },
  {
    path: "intro-to-shoot",
    loadChildren: () =>
      import("./pages/intro-to-shoot/intro-to-shoot.module").then(
        (m) => m.IntroToShootPageModule
      ),
  },
  {
    path: "profile-approval",
    loadChildren: () =>
      import("./pages/profile-approval/profile-approval.module").then(
        (m) => m.ProfileApprovalPageModule
      ),
  },
  {
    path: "bank-account-details",
    loadChildren: () =>
      import("./pages/bank-account-details/bank-account-details.module").then(
        (m) => m.BankAccountDetailsPageModule
      ),
  },
  {
    path: "identity-verification",
    loadChildren: () =>
      import("./pages/identity-verification/identity-verification.module").then(
        (m) => m.IdentityVerificationPageModule
      ),
  },
  {
    path: "market-yourself",
    loadChildren: () =>
      import("./pages/market-yourself/market-yourself.module").then(
        (m) => m.MarketYourselfPageModule
      ),
  },
  {
    path: "home-page",
    loadChildren: () =>
      import("./pages/home-page/home-page.module").then(
        (m) => m.HomePagePageModule
      ),
  },
  {
    path: "account-details",
    loadChildren: () =>
      import("./pages/account-details/account-details.module").then(
        (m) => m.AccountDetailsPageModule
      ),
  },
  {
    path: "gst-details",
    loadChildren: () =>
      import("./pages/gst-details/gst-details.module").then(
        (m) => m.GstDetailsPageModule
      ),
  },
  {
    path: "add-gst-details",
    loadChildren: () =>
      import("./pages/add-gst-details/add-gst-details.module").then(
        (m) => m.AddGstDetailsPageModule
      ),
  },
  {
    path: "aboutus-vendor",
    loadChildren: () =>
      import("./pages/aboutus-vendor/aboutus-vendor.module").then(
        (m) => m.AboutusVendorPageModule
      ),
  },
  {
    path: "service-request",
    loadChildren: () =>
      import("./pages/service-request/service-request.module").then(
        (m) => m.ServiceRequestPageModule
      ),
  },
  {
    path: "login-main",
    loadChildren: () =>
      import("./pages/login-main/login-main.module").then(
        (m) => m.LoginMainPageModule
      ),
  },
  {
    path: "user-home-page",
    loadChildren: () =>
      import("./userSection/home-page/home-page.module").then(
        (m) => m.HomePagePageModule
      ),
  },
  {
    path: "tabs",
    loadChildren: () =>
      import("./userSection/tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "user-booking",
    loadChildren: () =>
      import("./userSection/user-booking/user-booking.module").then(
        (m) => m.UserBookingPageModule
      ),
  },
  {
    path: "user-live-event",
    loadChildren: () =>
      import("./userSection/user-live-event/user-live-event.module").then(
        (m) => m.UserLiveEventPageModule
      ),
  },
  {
    path: "user-profile",
    loadChildren: () =>
      import("./userSection/user-profile/user-profile.module").then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: "booking-info",
    loadChildren: () =>
      import("./pages/booking-info/booking-info.module").then(
        (m) => m.BookingInfoPageModule
      ),
  },
  {
    path: "edit-profile",
    loadChildren: () =>
      import("./userSection/edit-profile/edit-profile.module").then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: "user-service-list",
    loadChildren: () =>
      import("./userSection/user-service-list/user-service-list.module").then(
        (m) => m.UserServiceListPageModule
      ),
  },
  {
    path: "user-service-detail",
    loadChildren: () =>
      import(
        "./userSection/user-service-detail/user-service-detail.module"
      ).then((m) => m.UserServiceDetailPageModule),
  },
  {
    path: "use-merchant-profile",
    loadChildren: () =>
      import(
        "./userSection/use-merchant-profile/use-merchant-profile.module"
      ).then((m) => m.UseMerchantProfilePageModule),
  },
  {
    path: "select-appoint-dt",
    loadChildren: () =>
      import("./userSection/select-appoint-dt/select-appoint-dt.module").then(
        (m) => m.SelectAppointDtPageModule
      ),
  },
  {
    path: "user-cart",
    loadChildren: () =>
      import("./userSection/user-cart/user-cart.module").then(
        (m) => m.UserCartPageModule
      ),
  },
  {
    path: "user-booking-list",
    loadChildren: () =>
      import("./userSection/user-booking-list/user-booking-list.module").then(
        (m) => m.UserBookingListPageModule
      ),
  },
  {
    path: "user-booking",
    loadChildren: () =>
      import("./userSection/user-booking/user-booking.module").then(
        (m) => m.UserBookingPageModule
      ),
  },
  {
    path: "business-details",
    loadChildren: () =>
      import("./pages/business-details/business-details.module").then(
        (m) => m.BusinessDetailsPageModule
      ),
  },
  {
    path: "user-contact-us",
    loadChildren: () =>
      import("./userSection/user-contact-us/user-contact-us.module").then(
        (m) => m.UserContactUsPageModule
      ),
  },
  {
    path: "working-area",
    loadChildren: () =>
      import("./pages/working-area/working-area.module").then(
        (m) => m.WorkingAreaPageModule
      ),
  },
  {
    path: "detail-page",
    loadChildren: () =>
      import("./pages/detail-page/detail-page.module").then(
        (m) => m.DetailPagePageModule
      ),
  },
  {
    path: "merchent-services-list",
    loadChildren: () =>
      import(
        "./pages/merchent-services-list/merchent-services-list.module"
      ).then((m) => m.MerchentServicesListPageModule),
  },
  {
    path: "user-register",
    loadChildren: () =>
      import("./pages/user-register/user-register.module").then(
        (m) => m.UserRegisterPageModule
      ),
  },
  {
    path: "mer-referral",
    loadChildren: () =>
      import("./pages/mer-referral/mer-referral.module").then(
        (m) => m.MerReferralPageModule
      ),
  },
  {
    path: "user-referral",
    loadChildren: () =>
      import("./userSection/user-referral/user-referral.module").then(
        (m) => m.UserReferralPageModule
      ),
  },
  {
    path: "start-service-otp",
    loadChildren: () =>
      import("./pages/start-service-otp/start-service-otp.module").then(
        (m) => m.StartServiceOtpPageModule
      ),
  },

  {
    path: "product-details",
    loadChildren: () =>
      import("./pages/product-details/product-details.module").then(
        (m) => m.ProductDetailsPageModule
      ),
  },
  {
    path: "product-list",
    loadChildren: () =>
      import("./pages/product-list/product-list.module").then(
        (m) => m.ProductListPageModule
      ),
  },
  {
    path: "m-contact-us",
    loadChildren: () =>
      import("./pages/m-contact-us/m-contact-us.module").then(
        (m) => m.MContactUsPageModule
      ),
  },

  {
    path: "pay-process",
    loadChildren: () =>
      import("./pages/pay-process/pay-process.module").then(
        (m) => m.PayProcessPageModule
      ),
  },

  {
    path: "subscription-process",
    loadChildren: () =>
      import("./pages/subscription-process/subscription-process.module").then(
        (m) => m.SubscriptionProcessPageModule
      ),
  },
  {
    path: "user-aboutus",
    loadChildren: () =>
      import("./userSection/user-aboutus/user-aboutus.module").then(
        (m) => m.UserAboutusPageModule
      ),
  },
  {
    path: "user-search-photographer",
    loadChildren: () =>
      import(
        "./userSection/user-search-photographer/user-search-photographer.module"
      ).then((m) => m.UserSearchPhotographerPageModule),
  },

  {
    path: "gallery",
    loadChildren: () =>
      import("./userSection/gallery/gallery.module").then(
        (m) => m.GalleryPageModule
      ),
  },
  {
    path: "user-product-list",
    loadChildren: () =>
      import("./userSection/user-product-list/user-product-list.module").then(
        (m) => m.UserProductListPageModule
      ),
  },
  {
    path: "user-product-detail",
    loadChildren: () =>
      import(
        "./userSection/user-product-detail/user-product-detail.module"
      ).then((m) => m.UserProductDetailPageModule),
  },

  {
    path: "category-name",
    loadChildren: () =>
      import("./userSection/category-name/category-name.module").then(
        (m) => m.CategoryNamePageModule
      ),
  },  {
    path: 'user-payment',
    loadChildren: () => import('./userSection/user-payment/user-payment.module').then( m => m.UserPaymentPageModule)
  },
  {
    path: 'end-serviceotp',
    loadChildren: () => import('./pages/end-serviceotp/end-serviceotp.module').then( m => m.EndServiceotpPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
