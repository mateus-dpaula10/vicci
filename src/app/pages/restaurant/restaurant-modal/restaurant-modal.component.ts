import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsRestaurantService } from '../../../services/products-restaurant.service';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-restaurant-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  templateUrl: './restaurant-modal.component.html',
  styleUrl: './restaurant-modal.component.scss',
  providers: [provideNgxMask()]
})
export class RestaurantModalComponent {
  private fb = inject(FormBuilder)
  private snackbar = inject(MatSnackBar)
  private productsRestaurantService = inject(ProductsRestaurantService)

  productsRestaurant: FormGroup = this.fb.group({
    name: [[], Validators.required],
    category: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  productsRestaurantCategories: any[] = ['Bebida', 'Carboidrato', 'Mix de saladas', 'Molhos', 'Omelete orgânico', 'Proteína']

  constructor(
    public dialogRef: MatDialogRef<RestaurantModalComponent>
  ) {}

  onSubmit() {
    if (this.productsRestaurant.invalid) {
      this.snackbar.open("Preencha todos os campos!", 'Fechar', { duration: 3000 })
      return
    }

    const payload = this.productsRestaurant.value
    this.productsRestaurantService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar produto!", 'Fechar', { duration: 3000 }))
  }
}
