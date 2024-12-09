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
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe, NgxMaskDirective],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  providers: [provideNgxMask()]
})

export class EmployeesComponent {
  private dialog = inject(MatDialog);
  private employeesService = inject(EmployeesService);
  private snackbar = inject(MatSnackBar);

  employees$ = this.employeesService.employees;

  displayedColumns: string[] = ['name', 'cpf', 'functionEmployee', 'hiringDate', 'unit', 'status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  openDialog(): void {
    const dialogRef = this.dialog.open(EmployeesModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("funcionário criado", );
    })
  }

  onSubmit(id: any, name: any, cpf: any, functionEmployee: any, hiringDate: any, unit: any, status: any) {
    this.employeesService.update(id, {
      name: name.value,
      cpf: cpf.value,
      functionEmployee: functionEmployee.value,
      hiringDate: hiringDate.value,
      unit: unit.value,
      status: status.value
    })
      .then(() => this.snackbar.open("Funcionário atualizado", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir funcionário?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.employeesService.delete(id)
        .then(() => this.snackbar.open("Funcionário excluído", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }

  formatCpf(cpfNumber: string): string {
    return `${cpfNumber.slice(0, 3)}.${cpfNumber.slice(3, 6)}.${cpfNumber.slice(6, 9)}-${cpfNumber.slice(9, 11)}`;
  }

  formatDate(birthNumber: string): string {
    return `${birthNumber.slice(0, 2)}/${birthNumber.slice(2, 4)}/${birthNumber.slice(4, 8)}`;
  }
}