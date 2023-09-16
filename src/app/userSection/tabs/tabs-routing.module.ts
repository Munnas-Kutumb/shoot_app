import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from '../tabs/tabs.page';

const routes: Routes = [
  {
    path: 'user-tabs',
    component: TabsPage,
    children: [
      
      {
          path: 'user-home-page',
          loadChildren: () => import('../home-page/home-page.module').then(m=> m.HomePagePageModule)

      },
      {
        path: 'user-live-event',
        loadChildren: () => import('../user-live-event/user-live-event.module').then(m=> m.UserLiveEventPageModule)

      },
      {
        path: 'user-profile',
        loadChildren: () => import('../user-profile/user-profile.module').then(m=> m.UserProfilePageModule)

      },
      {
        path: 'user-booking-list',
        loadChildren: () => import('../user-booking-list/user-booking-list.module').then(m=> m.UserBookingListPageModule)
      },
      {
        path: 'user-product-list',
        loadChildren: () => import('../user-product-list/user-product-list.module').then( m => m.UserProductListPageModule)
      },

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/user-tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}