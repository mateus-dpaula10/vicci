import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { EquipmentsService } from '../equipments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-equipments-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatIcon],
  templateUrl: './equipments-modal.component.html',
  styleUrl: './equipments-modal.component.scss'
})
export class EquipmentsModalComponent {
  private fb = inject(FormBuilder);
  private equipmentsService = inject(EquipmentsService);
  private snackbar = inject(MatSnackBar);
  private file: File | undefined;
  imagePreview: any;

  formEquipments: FormGroup = this.fb.group({
    name: [[], Validators.required],
    link: [[], Validators.required],
    photo: [],
  });

  constructor(
    public dialogRef: MatDialogRef<EquipmentsModalComponent>,
  ) { }

  onSubmit() {
    if (this.formEquipments.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formEquipments.value;
    this.equipmentsService.create(payload, this.file as File)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar equipamento", ))
  }

  onImageSelected(target: any) {
    this.file = target.files[0];
    if (this.file) {
      this.generateImagePreview(this.file);
    }
  }

  generateImagePreview(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
