import { Component, Inject, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../register/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingService } from './training.service';
import { TrainingModalComponent } from './training-modal/training-modal.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [MatFormField, MatSelect, ButtonComponent, MatOption, ReactiveFormsModule],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent {

  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private studentsService = inject(RegisterService);
  private trainingService = inject(TrainingService)

  students: any;
  studentInfo: any;

  training: any
  studentTraining: any;

  ngOnInit() {
    this.studentsService.students.subscribe((res) => this.students = res)
    this.trainingService.trainings.subscribe((res) => this.training = res)
  }

  formSelectStudent: FormGroup = this.fb.group({
    student: []
  })


  findStudent() {
    const payload = this.formSelectStudent.value
    if (!payload.student) {
      this.snackbar.open("Selecione um aluno")
      return;
    }
    this.studentInfo = this.students.filter((info: any) => info.id === payload.student)
    this.findStudentTraining()
  }

  findStudentTraining() {
    const payload = this.formSelectStudent.value
    this.studentTraining = this.training.filter((training: any) => training.studentId === payload.student)
  }

  openDialog(): void {
    const trainingRef = this.dialog.open(TrainingModalComponent, { data: this.formSelectStudent.value });

    trainingRef.afterClosed().subscribe(res => {
      if (!res) return
      this.findStudent()
    })
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir treino?", "Excluir")
    snackbarRef.onAction().subscribe(() => {
      this.trainingService.delete(id)
        .then(result => this.findStudent())
        .catch(() => this.snackbar.open("Erro ao deletar"))
    })
  }
}
