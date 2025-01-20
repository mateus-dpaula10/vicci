import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { HiredService } from '../teachers/hired/hired.service';
import { AssociateService } from '../teachers/associate/associate.service';
import { ScheduleModalComponent } from './schedule-modal/schedule-modal.component';
import { SchedulesService } from './schedules.service';
import { Observable } from 'rxjs';
import { ITeacher } from '../teachers/models/teacher.interface';
import { ISchedule } from './models/schedule.interface';
import { UnitServiceService } from '../units/unit-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgStyle, ButtonComponent, MatFormFieldModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  daysOfMonth: { day: any, dayOfWeek: any, isCurrentMonth: boolean, schedules: any[], classesByTeacher: any[], firstDayIndex: any }[] = [];

  private dialog = inject(MatDialog);
  private hiredService = inject(HiredService);
  private associateService = inject(AssociateService);
  private schedulesService = inject(SchedulesService);
  private getSchedules: Observable<any> = this.schedulesService.schedules;
  private unitService = inject(UnitServiceService);
  private fb = inject(FormBuilder)
  private snackbar = inject(MatSnackBar)

  currentMonth: number | any;
  currentYear: number | any;
  formSelectedUnit: FormGroup
  units: any[] = []
  teachersH: ITeacher[] = [];
  teachersA: ITeacher[] = [];
  schedules: ISchedule[] = [];
  showCalendar: boolean = false

  openDialog(): void {
    this.dialog.open(ScheduleModalComponent, { 
      data: {
        schedules: this.schedules,
        unitSelected: this.formSelectedUnit.get('unit')?.value,
      }
    })
  }

  async ngOnInit() {
    this.unitService.units.subscribe({
      next: (res) => {
        this.units = res
      },
      error: (err) => {
        console.error(err)
      }
    })

    this.formSelectedUnit = this.fb.group({
      unit: ['', Validators.required]
    })
  }

  async filterUnit() {
    if (this.formSelectedUnit.invalid) {
      this.snackbar.open("Preecha todos os campos corretamente!", 'Fechar', { duration: 3000 })
      return
    }

    this.showCalendar = true
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth();
    this.currentYear = currentDate.getFullYear();

    try {
      this.hiredService.teachersHired.subscribe(async (res) => {
        const teacherNames = await this.loadHiredTeachers()
        this.teachersH = teacherNames
          .map(name => ({
            name: name,
            color: this.generateRandomColor(),
            unit: res.find((t) => t.name === name)?.unit
          }))
          .filter((t) => t.unit === this.formSelectedUnit.get('unit')?.value)
      })
    } catch (error) {
      console.error('Erro ao carregar os professores contratados:', error)
    }    

    const selectedUnit = this.formSelectedUnit.get('unit')?.value
    
    let count = 0

    this.getSchedules.subscribe((res: any) => {
      if (count > 0) return
      count++

      this.schedules = res
        .map((schedule: any) => {
          const teacherDetails = this.findTeacher(schedule.teacher, this.teachersH)
          if (teacherDetails) {
            return { ...schedule, teacher: teacherDetails }
          }
          return schedule
        })
        .filter((schedule: any) => {
          return schedule.teacher?.unit === selectedUnit
        })

        this.splitSchedules()
    })

    this.calculateDaysOfMonth(this.currentMonth, this.currentYear);
  }

  loadHiredTeachers(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.hiredService.getFieldNames('name').subscribe({
        next: (names) => resolve(names),
        error: (err) => reject(err)
      });
    });
  }

  // loadAssociateTeachers(): Promise<[]> {
  //   return new Promise((resolve: any) => {
  //     this.associateService.getFieldNames('name').subscribe(names => {
  //       return resolve(names)
  //     })
  //   });
  // }

  calculateDaysOfMonth(month: number, year: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const firstDayIndex = firstDay.getDay(); // Dia da semana (0 - Domingo, 1 - Segunda, ...)

    this.daysOfMonth = [];

    const daysInPreviousMonth = new Date(year, month, 0).getDate(); // Último dia do mês anterior
    const startDay = (firstDayIndex === 0) ? 7 : firstDayIndex; // 1 (Domingo) a 7 (Sábado)

    for (let i = startDay - 1; i >= 0; i--) {
      const prevMonthDay = daysInPreviousMonth - i;
      this.daysOfMonth.push({
        day: prevMonthDay,
        dayOfWeek: daysOfWeek[i % 7],
        isCurrentMonth: false,
        schedules: [],
        classesByTeacher: [],
        firstDayIndex: firstDayIndex
      });
    }

    for (let day = 1; day <= lastDay; day++) {
      const dayOfWeek = daysOfWeek[(firstDayIndex + (day - 1)) % 7];
      this.daysOfMonth.push({
        day: day,
        dayOfWeek: dayOfWeek,
        isCurrentMonth: true,
        schedules: [],
        classesByTeacher: [],
        firstDayIndex: firstDayIndex
      });
    }
  }

  findTeacher(teacherName: string, teachersH: any[]): ITeacher | null {

    const hiredTeacher = teachersH.find(teacher => teacher.name === teacherName);
    if (hiredTeacher) {
      return hiredTeacher;
    }

    // const associateTeacher = teachersA.find(teacher => teacher.name === teacherName);
    // if (associateTeacher) {
    //   return associateTeacher;
    // }

    return null;
  }

  splitSchedules() {
    for (const schedule of this.schedules) {
      const date = new Date(schedule.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (month === this.currentMonth && year === this.currentYear) {
        const dayOfMonth = date.getDate();
        const index = dayOfMonth - 1;
        const firstDay = this.daysOfMonth[index].firstDayIndex

        if (this.daysOfMonth[index]) {

          this.daysOfMonth[index + firstDay].schedules.push(schedule);

        }
      }
    }

    this.daysOfMonth.forEach(day => {
      day.classesByTeacher = this.countClassesByTeachers(day.schedules);
    });
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.calculateDaysOfMonth(this.currentMonth, this.currentYear);
    this.splitSchedules();
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.calculateDaysOfMonth(this.currentMonth, this.currentYear);
    this.splitSchedules();
  }

  currentMonthName(): string {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return monthNames[this.currentMonth];
  }

  countClassesByTeachers(schedules: ISchedule[]) {
    const response: any = [];
    schedules.forEach(schedule => {
      if (response.some((object: any) => object.teacher === schedule.teacher.name)) {
        const index = response.findIndex((object: any) => object.teacher === schedule.teacher.name);
        response[index].classesCount += 1;
      } else {
        response.push({ teacher: schedule.teacher.name, classesCount: 1, color: schedule.teacher.color, unit: schedule.teacher.unit })
      }

    })
    return response;
  }

  generateRandomColor(): string {
    const randomHexComponent = () => {
      const minLightness = 180; // Ajuste este valor para determinar a "claridade" mínima
      const hex = (Math.floor(Math.random() * (256 - minLightness)) + minLightness).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const randomColor = `#${randomHexComponent()}${randomHexComponent()}${randomHexComponent()}`;
    return randomColor;
  }

  openDay(dayData: any) {
    this.dialog.open(CalendarModalComponent, { data: dayData })
  }
}