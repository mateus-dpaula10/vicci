import { Component, inject } from '@angular/core';
import { getAuth, signOut } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  user: any | null = null

  constructor(
    private usersService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.usersService.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  onLogout(): void {
    this.usersService.logout()
  }
}
