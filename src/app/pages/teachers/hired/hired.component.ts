import { Component, inject } from '@angular/core';
import { HiredModalComponent } from './hired-modal/hired-modal.component';
import { HiredService } from './hired.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { UnitServiceService } from '../../units/unit-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '../../../services/auth.service';
import { map, Observable } from 'rxjs';

@Component({  
  selector: 'hired',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    MatButtonModule, 
    MatTableModule, 
    ButtonComponent, 
    MatIconModule, 
    MatInputModule, 
    FormsModule, 
    AsyncPipe, 
    MatCheckboxModule,
    MatSelectModule, 
    MatOptionModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './hired.component.html',
  styleUrl: './hired.component.scss'
})
export class  HiredComponent {
  private dialog = inject(MatDialog);
  private hiredService = inject(HiredService);
  private snackbar = inject(MatSnackBar);
  private unitService = inject(UnitServiceService);
  private usersService = inject(AuthService)

  hired$: Observable<any[]> = this.usersService.fetchUsers
  hiredFiltered$: Observable<any[]> = this.hired$.pipe(
    map(items => items.filter(item => item.role === 'Instrutor'))
  )

  displayedColumns: string[] = ['name', 'expertise', 'schedules', 'unit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  units: any[] = []

  timeRange: string[] = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00'
  ]
  daysOfWeek: string[] = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  user: any | null = null

  async ngOnInit() {
    this.unitService.units.subscribe({
      next: (res) => {
        this.units = res
      },
      error: (err) => {
        console.error(err)
      }
    })
    
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.usersService.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(HiredModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Professor contratado criado");
    })
  }

  onSubmit(id: any, name: any, expertise: any, weekday: any, schedules: any, unit: any) {
    const payload = {
      name: name.value,
      expertise: expertise.value,
      weekday: weekday.value,
      schedules: schedules.value,
      unit: unit.value
    }

    this.usersService.update(id, payload)
      .then(() => this.snackbar.open("Professor contratado atualizado"))
      .catch(() => this.snackbar.open("Erro ao atualizar"))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir professor contratado?", "Excluir");
    snackbarRef.onAction().subscribe(() => {
      this.hiredService.delete(id)
        .then(() => this.snackbar.open("Professor contratado excluído"))
        .catch(() => this.snackbar.open("Erro ao excluir"))
    })
  }
}