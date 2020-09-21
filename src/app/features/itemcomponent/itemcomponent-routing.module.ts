import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemcomponentComponent } from './itemcomponent.component';


const routes: Routes = [{ path: '', component: ItemcomponentComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemcomponentRoutingModule { }
