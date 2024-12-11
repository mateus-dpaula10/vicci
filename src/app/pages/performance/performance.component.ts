import { Component, inject } from '@angular/core';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../register/register.service';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PerformanceModalComponent } from './performance-modal/performance-modal.component';
import { PerformanceService } from './performance.service';
import { filter, map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [MatSelectModule, MatOption, ButtonComponent, ReactiveFormsModule, FormsModule, MatIcon, CommonModule],
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.scss'
})
export class PerformanceComponent {
  
  private dialog = inject(MatDialog);
  private allStudents = inject(AuthService);
  private performanceService = inject(PerformanceService);
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar)

  students: Observable<any[]> = this.allStudents.fetchUsers
  studentsFiltered: Observable<any[]> = this.students.pipe(
    map(items => items.filter(item => item.role === 'Aluno'))
  )
  studentInfo: any;
  
  performances: any;
  studentPerformance: any;
  
  ngOnInit(){
    // this.studentsService.students.subscribe((res) =>{
    //   this.students = res
    // })

    this.performanceService.performances.subscribe((res) => {
      this.performances = res
    })
  }
  
  formSelectStudent: FormGroup = this.fb.group({
    student:[]
  })
  
  findStudent(){
    const payload = this.formSelectStudent.value
    if (!payload.student) {
      this.snackbar.open("Selecione um aluno")
      return
    }
    this.studentInfo = this.studentsFiltered.pipe(
      map(items => items.filter((info: any) => info.id === payload.student))
    ).subscribe(studentFiltered => {
      this.studentInfo = studentFiltered
    })
    this.filterPerformance()    
  }

  filterPerformance(){
    const payload = this.formSelectStudent.value
    this.studentPerformance = this.performances.filter((fx: any) => fx.student === payload.student)  
  }

  openDialog(): void {
    const performanceRef = this.dialog.open(PerformanceModalComponent, { data: this.formSelectStudent.value });

    performanceRef.afterClosed().subscribe(res => {
      if (!res) return
      this.findStudent()
    })
  }

  openPerformance(performance : any){
    const performanceRef = this.dialog.open(PerformanceModalComponent, {data: performance})
    performanceRef.afterClosed().subscribe(res => this.findStudent())
  }
}
