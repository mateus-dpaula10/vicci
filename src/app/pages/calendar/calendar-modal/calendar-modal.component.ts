import { NgStyle } from '@angular/common';
import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SchedulesService } from '../schedules.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './calendar-modal.component.html',
  styleUrl: './calendar-modal.component.scss'
})
export class CalendarModalComponent implements OnInit {
  private dialog = inject(MatDialog)
  private schedulesService = inject(SchedulesService)
  private snackbar = inject(MatSnackBar);
  private usersService = inject(AuthService)

  hoursDay: { hours: number, schedules: any[] }[] = [];

  ngOnInit() {
    this.insertScheduleByHour();
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.hoursDay = Array.from({ length: 24 }, (_, i) => ({ hours: i, schedules: [] }));
  }

  insertScheduleByHour() {
    this.data.dayData.schedules.forEach((schedule: any) => {
      const scheduleHour = parseInt(schedule.schedule)
      const calendarHour: any = this.hoursDay.find(hour => hour.hours == scheduleHour);
      calendarHour.schedules.push(schedule);
    });
  }

  openDialog(schedule: any): void { 
    this.dialog.open(ScheduleModalComponent, { 
      data: {
        schedule: schedule,
        unitSelected: this.data.unitSelected,
        schedules: this.data.schedules
      }
    })
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir horário?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.schedulesService.delete(id)
        .then(() => {
          // location.reload()
          this.snackbar.open("Horário excluído", )

        })
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
