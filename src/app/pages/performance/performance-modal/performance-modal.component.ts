import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { PerformanceService } from '../performance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-performance-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent],
  templateUrl: './performance-modal.component.html',
  styleUrl: './performance-modal.component.scss'
})
export class PerformanceModalComponent {
  private allStudents = inject(AuthService)
  private performanceService = inject(PerformanceService)
  private fb = inject(FormBuilder)
  private snackbar = inject(MatSnackBar)

  studentInfo: any
  student: any
  students: Observable<any[]> = this.allStudents.fetchUsers
  studentsFiltered: Observable<any[]> = this.students.pipe(
    map(items => items.filter(item => item.role === 'Aluno'))
  )
  isEditing: boolean = false

  dateNow: Date = new Date()
  date!: string

  formPerformance!: FormGroup
  studentName!: string

  constructor(
    public dialogRef: MatDialogRef<PerformanceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.studentsFiltered.subscribe(res => {
      this.student = res.find(i => i.id === this.data.student)
      if (this.student) {
        this.getDate()
        this.studentName = this.student.name

        this.formPerformance = this.fb.group({
          student:[this.data.student],
          name:[this.studentName],
          createdDate:[this.date],
          height:[this.data.height],
          weight:[this.data.weight],
          leanMass:[this.data.leanMass],
          bodyFat:[this.data.bodyFat],
          boneDensity:[this.data.boneDensity],
          bmr:[this.data.bmr],
          bodyWater:[this.data.bodyWater],
          bmi:[this.data.bmi],
        }) 
      }
    })
    
    if (this.data.createdDate){
      this.isEditing = true
    }
  }

  getDate(){
    const day = this.dateNow.getDate().toString().padStart(2, '0')
    const month =( this.dateNow.getMonth() + 1).toString().padStart(2, '0')
    const year = this.dateNow.getFullYear().toString()
    
    this.date = `${day}/${month}/${year}`
  }   
  
  onSubmit(){
    const payload = this.formPerformance.value
    this.setFields()
    this.performanceService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar"))    
  }

  onSubmitEdit(){
   const payload = this.formPerformance.value
   this.setFields()   
   this.performanceService.update(this.data.id, payload)
    .then(result => this.dialogRef.close(result))
    .catch(() => this.snackbar.open("Erro ao atualizar"))
  }

  onDelete(){
    const snackbarRef = this.snackbar.open("Deseja excluir desempenho?", "Excluir")
    snackbarRef.onAction().subscribe(() => {
      this.performanceService.delete(this.data.id)
        .then(result => this.dialogRef.close(result))
        .catch(() => this.snackbar.open("Erro ao deletar"))    
    })
  }

  setFields(){
    const payload = this.formPerformance.value
    payload.student = this.data.student
    payload.name  = this.studentName
    payload.createdDate = this.date
  }
}
