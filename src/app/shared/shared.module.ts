import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RouterModule } from '@angular/router'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { LoadingComponent } from './components/loading/loading.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TimepickerComponent } from './components/timepicker/timepicker.component';

const MODULES = [CommonModule, RouterModule, NgZorroAntdModule,ReactiveFormsModule,FormsModule];
const COMPONENTS = [LoadingComponent, TimepickerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...MODULES,...COMPONENTS],
})
export class SharedModule {}
