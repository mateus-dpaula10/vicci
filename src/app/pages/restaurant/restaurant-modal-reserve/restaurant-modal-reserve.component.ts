import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../../services/auth.service';
import { ProductsRestaurantReserveService } from '../../../services/products-restaurant-reserve.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-restaurant-modal-reserve',
  standalone: true,
  imports: [
    MatDialogModule, 
    ButtonComponent, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    FormsModule, 
    MatInputModule, 
    MatSelectModule,
    MatDatepickerModule,
    AsyncPipe
  ],
  templateUrl: './restaurant-modal-reserve.component.html',
  styleUrl: './restaurant-modal-reserve.component.scss'
})
export class RestaurantModalReserveComponent {
  private fb = inject(FormBuilder)
  private snackbar = inject(MatSnackBar)
  private productsRestaurantReserveService = inject(ProductsRestaurantReserveService)
  private usersService = inject(AuthService)

  constructor(
    public dialogRef: MatDialogRef<RestaurantModalReserveComponent>
  ) {}

  user: any | null = null
  productsRestaurant: FormGroup = this.fb.group({
    name: [Validators.required],
    date: [Validators.required],
    time: [Validators.required]
  })
  times: any[] = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
  ]
  usersAll$: Observable<any[]> = this.usersService.fetchUsers.pipe(    
    map(users => users.filter(user => user.role === 'Aluno'))
  )

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

  onSubmit() {
    if (this.productsRestaurant.invalid) {
      this.snackbar.open("Preencha todos os campos!", 'Fechar', { duration: 3000 })
      return
    }

    const payload = this.productsRestaurant.value
    this.productsRestaurantReserveService.create(payload)
      .then(result => {
        this.dialogRef.close(result)
      } )
      .catch(() => this.snackbar.open("Erro ao realizar a reserva!", 'Fechar', { duration: 3000 }))
  }
}
