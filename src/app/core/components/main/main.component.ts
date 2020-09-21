import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-layout-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LayoutMainComponent {
  isCollapsed = false

  constructor(private router: Router) {}

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed
  }

  logout(): void {
    localStorage.removeItem('currentuser')
    this.router.navigate(['login'])
  }
}
