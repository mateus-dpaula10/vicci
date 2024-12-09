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
import { RegisterService } from '../../register/register.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SchedulesService } from '../schedules.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ISchedule } from '../models/schedule.interface';


enum ListRole {
  ASSOCIATES,
  CONTRACTORS
}

@Component({
  selector: 'app-schedule-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent, MatSelectModule, NgxMaskDirective, MatRadioModule, FormsModule, MatAutocompleteModule],
  templateUrl: './schedule-modal.component.html',
  styleUrl: './schedule-modal.component.scss'
})
export class ScheduleModalComponent {

  private fb = inject(FormBuilder);
  private hiredService = inject(HiredService);
  private associateService = inject(AssociateService);
  private studentService = inject(RegisterService);
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

  constructor(
    public dialogRef: MatDialogRef<ScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISchedule[]
  ) { }

  students: any
  schedulesTeacherDate: any

  async ngOnInit(): Promise<void> {
    this.setSubscriber();
    this.setAssociatedTeachers();
    this.studentService.students.subscribe((res) => {
      this.students = res
    })

  }

  setSubscriber(): void {
    this.formSchedules.controls['listRole'].valueChanges.subscribe((value: ListRole) => {
      if (value == ListRole.ASSOCIATES)
        this.setAssociatedTeachers();
      else
        this.setHiredTeachers();
    });
  }

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
    const payload = this.formSchedules.value;
    let teacherSchedules: ISchedule[] = this.data.filter((schedule: ISchedule) => schedule.teacher.name == payload.teacher);
    if (teacherSchedules.length >= 3) {
      const selectedDate: Date = new Date(payload.date)

      teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getFullYear() == selectedDate.getFullYear());
      teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getMonth() == selectedDate.getMonth());
      teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getDate() == selectedDate.getDate());
      teacherSchedules = teacherSchedules.filter((schedule: ISchedule) => new Date(schedule.date).getHours() == selectedDate.getHours());

      if (teacherSchedules.length >= 3) {
        this.snackbar.open("Quantidade de aulas excedida por professor");
        return;
      }
    }
    this.schedulesService.create(payload)
      .then((result) => {
        this.snackbar.open("Horário adicionado com sucesso");
        this.dialogRef.close(result);
      })

      .catch(() => this.snackbar.open("Erro ao adicionar horário"));
  }
}