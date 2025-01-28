import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService)

  user: any | null = null

  async ngOnInit() {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.authService.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  onLogout(): void {
    this.authService.logout()
  }
}
