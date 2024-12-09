import { Component, inject } from '@angular/core';
import { RestaurantProtService } from '../restaurant-prot.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-restaurant-prot-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './restaurant-prot-modal.component.html',
  styleUrl: './restaurant-prot-modal.component.scss'
})
export class RestaurantProtModalComponent {
  private fb = inject(FormBuilder);
  private protService = inject(RestaurantProtService);
  private snackbar = inject(MatSnackBar);

  formProt: FormGroup = this.fb.group({
    name: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<RestaurantProtModalComponent>,
  ) { }

  onSubmit() {
    if (this.formProt.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formProt.value
    this.protService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ));
  }
}

