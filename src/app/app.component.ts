import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, HeaderComponent],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vicci-studio';
  showInnerComponents: boolean = false;

  constructor(private location: Location) {
    this.location.onUrlChange((url: string) => {
      this.showInnerComponents = !url.includes('/login');
    });
  }
}
