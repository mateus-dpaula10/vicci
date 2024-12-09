import { Component, Input, booleanAttribute } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'vicci-button',
  standalone: true,
  imports: [MatButton],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({transform: booleanAttribute}) accent: boolean = false;
  @Input({transform: booleanAttribute}) warn: boolean = false;
}
