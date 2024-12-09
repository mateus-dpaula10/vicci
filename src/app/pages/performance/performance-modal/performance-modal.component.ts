import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RegisterService } from '../../register/register.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { PerformanceService } from '../performance.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-performance-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './performance-modal.component.html',
  styleUrl: './performance-modal.component.scss'
})
export class PerformanceModalComponent {

  private studentsService = inject(RegisterService);
  private performanceService = inject(PerformanceService)
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

    studentInfo: any;
    student: any;
    studentName: any;
    isEditing: boolean = false;

    dateNow: Date = new Date();
    date: any;

    constructor(
      public dialogRef: MatDialogRef<PerformanceModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
    this.studentsService.students.subscribe((res) => {
      this.student = res
      this.getName()
      this.getDate()
    })
    console.log(this.data);
    
    if(this.data.createdDate){
      this.isEditing = true
    }
  }
  
    getName(){
      this.studentInfo = this.student.filter((info: any) => info.id === this.data.student);
      this.studentName = this.studentInfo[0].name;
    }

  getDate(){
    const day = this.dateNow.getDate().toString()
    const month =( this.dateNow.getMonth() + 1).toString()
    const year = this.dateNow.getFullYear().toString()
    
    this.date = day + "/" + month + "/" + year
  }  
  
  formPerformance: FormGroup = this.fb.group({
    student:[this.data.student],
    name:[],
    createdDate:[],
    height:[this.data.height],
    weight:[this.data.weight],
    leanMass:[this.data.leanMass],
    bodyFat:[this.data.bodyFat],
    boneDensity:[this.data.boneDensity],
    bmr:[this.data.bmr],
    bodyWater:[this.data.bodyWater],
    bmi:[this.data.bmi],
  })
  
  
  onSubmit(){
    const payload = this.formPerformance.value;
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
