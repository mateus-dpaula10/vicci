import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { UnitServiceService } from '../unit-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnitsImagesService } from '../units-images.service';

@Component({
  selector: 'app-units-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatIcon],
  templateUrl: './units-modal.component.html',
  styleUrl: './units-modal.component.scss'
})
export class UnitsModalComponent {

  private fb = inject(FormBuilder);
  private unitsService = inject(UnitServiceService);
  private snackbar = inject(MatSnackBar);
  private unitsImages = inject(UnitsImagesService)

  private files: File[] = [];

  imagesPreview: any[] = [];
  multipleImages: boolean = false;
  lengthImages: any;
  unitId: any;

  formUnits: FormGroup = this.fb.group({
    name: [[], Validators.required],
    address: [[], Validators.required],
    businessHours: [[], Validators.required],
    photo: [],
  });

  constructor(public dialogRef: MatDialogRef<UnitsModalComponent>) { }

  onSubmit() {
    const payload = this.formUnits.value;

    if (this.formUnits.invalid) {
      this.snackbar.open("Preencha todos os campos")
      return
    }
    this.unitsService.create(payload)
      .then(result => {
        if (this.files.length > 0) {
          for (let i = 0; i < this.files.length; i++) {
            this.unitsImages.createImages(this.files[i], result.id)
            console.log("entra no outro create");
          }
        }
        this.dialogRef.close(result)
      })
      .catch((error) => {
        this.snackbar.open("Erro ao cadastrar equipamento")
        console.log(error.message);
      })
  }

  onImageSelected(event: any) {
    const files = event.files;

    if (!files && files.length <= 0)
      return;

    this.files = [];
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i])
    }

    this.generateImagePreview(this.files);
  }

  generateImagePreview(files: File[]) {
    this.imagesPreview = [];
    files.forEach((file: File, index: number) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => this.imagesPreview.push(reader.result);
    })
  }
}