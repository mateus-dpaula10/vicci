import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private usersAll = inject(AuthService)

  currentUser: any | null = null

  async ngOnInit() {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.currentUser = await this.usersAll.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.currentUser = null
    }
  }
}
