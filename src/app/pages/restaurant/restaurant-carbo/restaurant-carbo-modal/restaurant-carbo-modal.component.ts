import { Component, inject } from '@angular/core';
import { RestaurantCarboService } from '../restaurant-carbo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-restaurant-carbo-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './restaurant-carbo-modal.component.html',
  styleUrl: './restaurant-carbo-modal.component.scss'
})
export class RestaurantCarboModalComponent {

  private fb = inject(FormBuilder);
  private carboService = inject(RestaurantCarboService);
  private snackbar = inject(MatSnackBar);

  formCarbo: FormGroup = this.fb.group({
    name: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<RestaurantCarboModalComponent>,
  ) { }

  onSubmit() {
    if (this.formCarbo.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formCarbo.value
    this.carboService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ));
  }
}

