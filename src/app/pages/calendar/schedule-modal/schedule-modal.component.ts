import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatRadioModule } from '@angular/material/radio';
import { HiredService } from '../../teachers/hired/hired.service';
import { AssociateService } from '../../teachers/associate/associate.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SchedulesService } from '../schedules.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ISchedule } from '../models/schedule.interface';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

enum ListRole {
  ASSOCIATES,
  CONTRACTORS
}

@Component({
  selector: 'app-schedule-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatSelectModule, NgxMaskDirective, MatRadioModule, FormsModule, MatAutocompleteModule, CommonModule],
  templateUrl: './schedule-modal.component.html',
  styleUrl: './schedule-modal.component.scss'
})
export class ScheduleModalComponent {

  private fb = inject(FormBuilder);
  private hiredService = inject(HiredService);
  private associateService = inject(AssociateService);
  private allStudents = inject(AuthService);
  private schedulesService = inject(SchedulesService);
  private snackbar = inject(MatSnackBar)

  listRole = ListRole;
  teachers: any[] = [];
  formSchedules: FormGroup = this.fb.group({
    student: [[], Validators.required],
    listRole: [ListRole.ASSOCIATES],
    teacher: [[], Validators.required],
    date: [[], Validators.required],
  });
  user: any | null = null

  constructor(
    public dialogRef: MatDialogRef<ScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISchedule[]
  ) { }
  
  students$: Observable<any[]> = this.allStudents.fetchUsers
  studentsFiltered$: Observable<any[]> = this.students$.pipe(
    map(items => items.filter(item => item.role === 'Aluno'))
  )
  schedulesTeacherDate: any

  async ngOnInit(): Promise<void> {
    // this.setSubscriber()
    // this.setAssociatedTeachers()
    this.setHiredTeachers()
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.allStudents.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  // setSubscriber(): void {
  //   this.formSchedules.controls['listRole'].valueChanges.subscribe((value: ListRole) => {
  //     if (value == ListRole.ASSOCIATES)
  //       this.setAssociatedTeachers();
  //     else
  //       this.setHiredTeachers();
  //   });
  // }

  private setAssociatedTeachers(): void {
    this.associateService.teachersAssociate.subscribe({
      next: (teachers: any[]) => this.teachers = teachers,
      error: () => this.teachers = []
    });
  }

  private setHiredTeachers(): void {
    this.hiredService.teachersHired.subscribe({
      next: (teachers: any[]) => this.teachers = teachers,
      error: () => this.teachers = []
    });
  }

  onSubmit(): void {
    if (this.formSchedules.invalid) {
      this.snackbar.open("Preencha todos os campos corretamente!", 'Fechar', { duration: 3000 })
      return
    }

    const payload = this.formSchedules.value;
    let teacherSchedules: ISchedule[] = this.data.filter((schedule: ISchedule) => schedule.teacher.name == payload.teacher);
    let studentSchedules: ISchedule[] = this.data.filter((schedule: ISchedule) => schedule.student == payload.student && schedule.date == payload.date)

    const selectedDate: Date = new Date(payload.date)
    
    teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getFullYear() == selectedDate.getFullYear());
    teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getMonth() == selectedDate.getMonth());
    teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getDate() == selectedDate.getDate());
    teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getHours() == selectedDate.getHours());
    
    if (teacherSchedules.length >= 2) {
      this.snackbar.open(`Quantidade de aulas do(a) professor(a) ${payload.teacher} excedida em ${selectedDate.toLocaleDateString('pt-BR')} - ${payload.date.substring(11, 16)}`)
      return
    } else if (studentSchedules.length >= 1) {
      this.snackbar.open(`Quantidade de aulas do(a) aluno(a) ${payload.student} excedida em ${selectedDate.toLocaleDateString('pt-BR')} - ${payload.date.substring(11, 16)}`) 
      return
    }

    this.schedulesService.create(payload)
      .then((result) => {
        this.snackbar.open("Horário adicionado com sucesso");
        this.dialogRef.close(result);
      })
      .catch(() => this.snackbar.open("Erro ao adicionar horário"));
  }
}