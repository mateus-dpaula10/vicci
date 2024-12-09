import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AssociateComponent } from './associate/associate.component';
import { HiredComponent } from './hired/hired.component';


@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [MatTabsModule, AssociateComponent, HiredComponent],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent {
}