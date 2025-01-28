import { Component, inject } from '@angular/core';
import { EmployeesService } from './employees.service';
import { EmployeesModalComponent } from './employees-modal/employees-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { UnitServiceService } from '../units/unit-service.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-employees',
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
    NgxMaskDirective,
    MatSelectModule,
    MatOptionModule,
    AsyncPipe
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  providers: [provideNgxMask()]
})

export class EmployeesComponent {
  private dialog = inject(MatDialog);
  private employeesService = inject(EmployeesService);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private unitsService = inject(UnitServiceService);

  students$: Observable<any[]> = this.authService.fetchUsers.pipe(
    map(students => students.filter(student => student.role === 'Colaborador'))
  )
  studentsFiltered$: Observable<any[]>

  units$: Observable<any[]> = this.unitsService.units
  sectors: any[] = ['Limpeza', 'Recepção']

  displayedColumns: string[] = ['name', 'email', 'cpf', 'hiring_date', 'sector'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  user: any | null = null

  async ngOnInit() {
    this.loadUser()    
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.authService.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }

    for (let unit of this.user.units) {
      this.studentsFiltered$ = this.students$.pipe(
        map(students => students.filter(student => student.units.includes(unit))))
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EmployeesModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("funcionário criado", );
    })
  }

  onSubmit(id: any, name: any, email: any, cpf: any, units: any, hiring_date: any, sector: any) {
    const payload = {
      name: name.value,
      email: email.value,
      cpf: cpf.value,
      units: units.value,
      hiring_date: hiring_date.value,
      sector: sector.value
    }

    this.employeesService.update(id, payload)
      .then(() => this.snackbar.open("Colaborador atualizado com sucesso!", 'Fechar', { duration: 3000 } ))
      .catch(() => this.snackbar.open("Erro ao atualizar Colaborador!", 'Fechar', { duration: 3000 } ))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir Colaborador?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.employeesService.delete(id)
        .then(() => this.snackbar.open("Colaborador excluído com sucesso!", 'Fechar', { duration: 3000 } ))
        .catch(() => this.snackbar.open("Erro ao excluir Colaborador!", 'Fechar', { duration: 3000 } ))
    })
  }

  formatCpf(cpfNumber: string): string {
    return `${cpfNumber.slice(0, 3)}.${cpfNumber.slice(3, 6)}.${cpfNumber.slice(6, 9)}-${cpfNumber.slice(9, 11)}`;
  }

  formatDate(birthNumber: string): string {
    return `${birthNumber.slice(0, 2)}/${birthNumber.slice(2, 4)}/${birthNumber.slice(4, 8)}`;
  }
}