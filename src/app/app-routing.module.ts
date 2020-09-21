import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './core/guards/auth.guard'
import { NotFoundComponent } from './core/components/error/notfound.component'
import { AppPreloader } from './app-routing-loader'
import { SharedModule } from './shared/shared.module'
import { LayoutMainComponent } from './core/components/main/main.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'item',
        loadChildren: () => import('./features/itemcomponent/itemcomponent.module').then(m => m.ItemcomponentModule),
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  }
]

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forRoot(routes, { preloadingStrategy: AppPreloader }),
  ],
  exports: [RouterModule],
  providers: [AppPreloader],
})
export class AppRoutingModule {}
