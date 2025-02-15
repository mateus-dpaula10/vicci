import { Component, Inject, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
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
  private hiredService = inject(HiredService);
  private usersService = inject(AuthService);
  private associateService = inject(AssociateService);
  private allStudents = inject(AuthService);
  private schedulesService = inject(SchedulesService);
  private snackbar = inject(MatSnackBar)

  constructor(
    public dialogRef: MatDialogRef<ScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }

  isEditMode: boolean = false
  formSchedules: FormGroup
  listRole = ListRole;
  teachers: any[] = [];
  user: any | null = null

  unitSelected: string = ''
  schedules: ISchedule[] = []
  
  students$: Observable<any[]> = this.allStudents.fetchUsers.pipe(
    map(items => items.filter(item => item.role === 'Aluno'))
  )
  schedulesTeacherDate: any
  selectedTeacher: any = null
  availableDates: any[] = []

  async ngOnInit(): Promise<void> {
    // this.setSubscriber()
    // this.setAssociatedTeachers()
    this.setHiredTeachers()
    this.loadUser()

    this.unitSelected = this.data.unitSelected,
    this.schedules = this.data.schedules
    this.formSchedules = this.fb.group({
      student: [this.data.schedule?.student || '', Validators.required],
      // listRole: [ListRole.ASSOCIATES],
      teacher: [this.data.schedule?.teacher?.name || '', Validators.required],
      date: [this.data.schedule?.date || '', Validators.required],
      schedule: [this.data.schedule?.schedule || '', Validators.required],
    })  

    const initialTeacher = this.formSchedules.get('teacher')?.value
    if (initialTeacher) {
      this.onTeacherChange(initialTeacher)
    }

    this.formSchedules.get('teacher')?.valueChanges.subscribe((value) => {
      this.onTeacherChange(value)
    });
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

  // private setAssociatedTeachers(): void {
  //   this.associateService.teachersAssociate.subscribe({
  //     next: (teachers: any[]) => this.teachers = teachers,
  //     error: () => this.teachers = []
  //   });
  // }

  getDatesForWeekdays(weekdays: string[], year: number, month: number): Date[] {
    const dates: Date[] = []
    
    const daysOfWeekMap: { [key: string]: number } = {
      'Domingo': 0,
      'Segunda-feira': 1,
      'Terça-feira': 2,
      'Quarta-feira': 3,
      'Quinta-feira': 4,
      'Sexta-feira': 5,
      'Sábado': 6
    }

    const daysOfWeek = weekdays.map(day => daysOfWeekMap[day])
    
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)

      if (daysOfWeek.includes(date.getDay())) {
        dates.push(date)
      }
    }

    return dates
  }

  private setHiredTeachers(): void {
    this.usersService.fetchUsers.subscribe({
      next: (teachers: any[]) => {
        this.teachers = teachers
          .filter((t) => Array.isArray(t.unit) && t.unit.includes(this.unitSelected))
          .map((teacher) => ({
            ...teacher,
            weekday: teacher.weekday || [],
            schedules: teacher.schedules || [],
          }))
      },
      error: () => this.teachers = []
    });
  }

  onTeacherChange(teacherName: string): void {
    this.selectedTeacher = this.teachers.find((t) => t.name === teacherName)

    if (this.selectedTeacher) {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      this.availableDates = this.getDatesForWeekdays(this.selectedTeacher.weekday, year, month)
    }
  }

  onSubmit(): void {
    if (this.formSchedules.invalid) {
      this.snackbar.open("Preencha todos os campos corretamente!", 'Fechar', { duration: 3000 })
      return
    }

    const payload = this.formSchedules.value

    const teacherSchedules: ISchedule[] = this.data.schedules.filter((schedule: ISchedule) => schedule.teacher.name == payload.teacher && schedule.date == payload.date && schedule.schedule == payload.schedule)
    const studentSchedules: ISchedule[] = this.data.schedules.filter((schedule: ISchedule) => schedule.student == payload.student && schedule.date == payload.date && schedule.schedule == payload.schedule)

    const selectedDate: Date = new Date(payload.date)
    
    if (teacherSchedules.length >= 2) {
      this.snackbar.open(`Quantidade de aulas do(a) professor(a) ${payload.teacher} excedida em ${selectedDate.toLocaleDateString('pt-BR')} - ${payload.schedule}`)
      return
    } else if (studentSchedules.length >= 1) {
      this.snackbar.open(`Quantidade de aulas do(a) aluno(a) ${payload.student} excedida em ${selectedDate.toLocaleDateString('pt-BR')} - ${payload.schedule}`) 
      return
    }

    if (this.data.schedule) {
      payload.id = this.data.schedule.id
      this.schedulesService.update(payload.id, payload)
        .then((result) => {
          this.snackbar.open("Horário atualizado com sucesso");
          this.dialogRef.close(result);
        })
        .catch(() => this.snackbar.open("Erro ao atualizar horário"));
    } else {    
      this.schedulesService.create(payload)
        .then((result) => {
          this.snackbar.open("Horário adicionado com sucesso");
          this.data.schedules.push(result)
          this.dialogRef.close(result);
        })
        .catch(() => this.snackbar.open("Erro ao adicionar horário"));
    }
  }
}