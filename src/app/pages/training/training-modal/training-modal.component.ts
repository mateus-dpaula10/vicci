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

  private studentsService = inject(RegisterService);
  private equipmentsService = inject(EquipmentsService);
  private trainingService = inject(TrainingService);
  private exerciseService = inject(ExercisesService)


  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  student: any;
  equipments: any;
  exercises: any;
  trainings: any;

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
    name: [[], Validators.required]
  })

  formTraining: FormGroup = this.fb.group({
    equipment: [],
    reps: [],
    sets: []
  })

  saveExercise() {
    const payload = this.formTraining.value
    this.exercisesArray.push(payload)
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
    this.trainingExercises.push(this.exercisesArray)
    const name = this.formNameTraining.value.name
    const allInfo = { name: name, exercises: this.trainingExercises[0], studentId: this.data.student }

    this.trainingService.create(allInfo)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.exercisesArray = [])
  }

  onDelete(id: any) {
    const index = this.exercisesArray.indexOf(id)
    if (index > -1) this.exercisesArray.splice(index, 1);
  }
}
