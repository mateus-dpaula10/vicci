import { Component, inject } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UnitServiceService } from '../../units/unit-service.service';

@Component({
  selector: 'app-employees-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatSelectModule, NgxMaskDirective],
  templateUrl: './employees-modal.component.html',
  styleUrl: './employees-modal.component.scss',
  providers: [provideNgxMask()]
})

export class EmployeesModalComponent {

  private fb = inject(FormBuilder);
  private employeesService = inject(EmployeesService);
  private snackbar = inject(MatSnackBar);
  private unitsService = inject(UnitServiceService)

  units: any[] = []
  formEmployees: FormGroup = this.fb.group({
    name: [[], Validators.required],
    cpf: [[], Validators.required],
    functionEmployee: [[], Validators.required],
    hiringDate: [[], Validators.required],
    unit: [[], Validators.required],
    status: [[], Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<EmployeesModalComponent>,
  ) { }

  ngOnInit(){
    this.unitsService.units.subscribe((res) => {
      this.units = res
    })
  }

  onSubmit() {
    if (this.formEmployees.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formEmployees.value;
    this.employeesService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ))
  }
}