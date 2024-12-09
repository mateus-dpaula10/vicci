import { Component, inject } from '@angular/core';
import { RestaurantOmeletService } from '../restaurant-omelet.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-restaurant-omelet-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './restaurant-omelet-modal.component.html',
  styleUrl: './restaurant-omelet-modal.component.scss'
})
export class RestaurantOmeletModalComponent {

  private fb = inject(FormBuilder);
  private omeletService = inject(RestaurantOmeletService);
  private snackbar = inject(MatSnackBar);

  formOmelet: FormGroup = this.fb.group({
    name: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<RestaurantOmeletModalComponent>,
  ) { }

  onSubmit() {
    if (this.formOmelet.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formOmelet.value
    this.omeletService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ));
  }
}

