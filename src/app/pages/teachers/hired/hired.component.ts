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
    CommonModule
  ],
  templateUrl: './hired.component.html',
  styleUrl: './hired.component.scss'
})
export class HiredComponent {
  private dialog = inject(MatDialog);
  private hiredService = inject(HiredService);
  private snackbar = inject(MatSnackBar);
  private unitService = inject(UnitServiceService);

  hired$ = this.hiredService.teachersHired;

  displayedColumns: string[] = ['name', 'expertise', 'schedules', 'unit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  units: any[] = []

  async ngOnInit() {
    this.unitService.units.subscribe({
      next: (res) => {
        this.units = res
      },
      error: (err) => {
        console.error(err)
      }
    })
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

  onSubmit(id: any, name: any, expertise: any, schedules: any, unit: any) {
    const payload = {
      name: name.value,
      expertise: expertise.value,
      schedules: schedules.value,
      unit: unit.value
    }

    this.hiredService.update(id, payload)
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