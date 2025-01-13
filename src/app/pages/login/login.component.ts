import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface User {
  uid: string,
  email: string,
  password: string,
  status: 'pendente' | 'aprovado',
  role: string | null,
  createdAt: Date
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatIcon],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private authService = inject(AuthService);

  hide = true;
  create = false;

  formLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  formCreate: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  })

  changeDiv() {
    this.create = !this.create
    this.formCreate.reset()
    this.formLogin.reset()
  }

  async onSubmitLogin() {
    if (this.formLogin.invalid) {
      this.snackbar.open("Por favor, preencha os campos corretamente!", 'Fechar', { duration: 3000 })
      return
    }

    const { email, password } = this.formLogin.value

    await this.authService.login(email, password)
  }

  async onSubmitCreate() {
    if (this.formCreate.invalid || !this.validatePassword()) {
      return
    }

    const { name, email, password } = this.formCreate.value

    await this.authService.registerUser(name, email, password)
    this.changeDiv()
  }

  private validatePassword(): boolean {
    const { password, confirmPassword } = this.formCreate.value

    if (password !== confirmPassword) {
      this.snackbar.open("Senhas diferentes!", 'Fechar', { duration: 3000 })
      return false;
    }
    return true;
  }
}
