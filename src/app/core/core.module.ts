import { NgModule } from '@angular/core'

import { MainLayoutComponent } from './components/layout/main-layout.component'
import { SharedModule } from '../shared/shared.module'
import { CoreRoutingModule } from './core-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoginComponent } from './components/login/login.component'
import { NotFoundComponent } from './components/error/notfound.component'
import { LayoutMainComponent } from './components/main/main.component'

const COMPONENTS = [LoginComponent, NotFoundComponent, MainLayoutComponent, LayoutMainComponent]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    // vendor
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    CoreRoutingModule,
  ],
})
export class CoreModule {}
