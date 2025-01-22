import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from '../../register/register.service';
import { MatOption } from '@angular/material/core';
import { EquipmentsService } from '../../equipments/equipments.service';
import { MatSelect } from '@angular/material/select';
import { TrainingService } from '../training.service';
import { ExercisesService } from '../exercises.service';

@Component({
  selector: 'app-training-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatOption, MatSelect],

  templateUrl: './training-modal.component.html',
  styleUrl: './training-modal.component.scss'
})
export class TrainingModalComponent {
  private studentsService = inject(RegisterService)
  private equipmentsService = inject(EquipmentsService)
  private trainingService = inject(TrainingService)
  private exerciseService = inject(ExercisesService)
  private fb = inject(FormBuilder)
  private snackbar = inject(MatSnackBar)

  student: any
  equipments: any
  exercises: any
  trainings: any
  isAdding: boolean = false
  trainingExercises: any[] = []
  exercisesArray: any[] = []

  constructor(
    public dialogRef: MatDialogRef<TrainingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.studentsService.students.subscribe((res) => this.student = res)
    this.equipmentsService.equipments.subscribe((res) => this.equipments = res)
    this.exerciseService.exercises.subscribe((res) => this.exercises = res)
    this.trainingService.trainings.subscribe((res) => this.trainings = res)
  }  

  formNameTraining: FormGroup = this.fb.group({
    name: [this.data.training?.name || '', Validators.required]
  })

  formTraining: FormGroup = this.fb.group({
    equipment: [this.data.training?.exercises.equipment || '', Validators.required],
    reps: [this.data.training?.exercises.equipment || null, [Validators.required, Validators.min(1)]],
    sets: [this.data.training?.exercises.sets || null, [Validators.required, Validators.min(1)]],
    duration: [this.data.training?.exercises.duration || null, Validators.required],
  })

  saveExercise() {
    const payload = this.formTraining.value

    if (this.data.training) {
      this.data.training.exercises = [...this.data.training.exercises, payload]
    } else {
      this.exercisesArray.push(payload)
    }

    this.toggleAdding()
  }

  toggleAdding() {
    this.isAdding = !this.isAdding
    this.formTraining.reset()
  }

  onSubmit() {
    if (this.formNameTraining.invalid) {
      this.snackbar.open("Preencha todos os campos corretamente")
      return;
    }

    const exercises = this.data.training ? this.data.training.exercises : this.exercisesArray
    const name = this.formNameTraining.value.name
    const studentId = this.data?.student.student || this.data.student
    const allInfo = {
      name: name, 
      exercises: exercises, 
      studentId: studentId
    } 

    if (this.data.training) {
      this.trainingService.update(this.data.training.id, allInfo)
        .then(result => this.dialogRef.close(result))
        .catch(() => {
          this.exercisesArray = []
        })
    } else {
      this.trainingService.create(allInfo)
        .then(result => this.dialogRef.close(result))
        .catch(() => {
          this.exercisesArray = []
        })
    }
  }

  onDelete(id: any) {
    if (this.data.training) {
      this.data.training.exercises = this.data.training.exercises.filter((exercise: any) => exercise !== id)
    } else {
      this.exercisesArray = this.exercisesArray.filter((exercise: any) => exercise !== id)
    }
  }
}
