import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { AssociateService } from './associate.service';
import { AssociateModalComponent } from './associate-modal/associate-modal.component';

@Component({
  selector: 'associate',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './associate.component.html',
  styleUrl: './associate.component.scss'
})
export class AssociateComponent {

  private dialog = inject(MatDialog);
  private associateService = inject(AssociateService);
  private snackbar = inject(MatSnackBar);

  associate$ = this.associateService.teachersAssociate;

  displayedColumns: string[] = ['name', 'expertise', 'schedules'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  openDialog(): void {
    const dialogRef = this.dialog.open(AssociateModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Professor associado criado");
    })
  }

  onSubmit(id: any, name: any, expertise: any, schedules: any) {
    this.associateService.update(id, {
      name: name.value,
      expertise: expertise.value,
      schedules: schedules.value
    })
      .then(() => this.snackbar.open("Professor associado atualizado"))
      .catch(() => this.snackbar.open("Erro ao atualizar"))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir professor associado?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.associateService.delete(id)
        .then(() => this.snackbar.open("Professor associado excluído"))
        .catch(() => this.snackbar.open("Erro ao excluir"))
    })
  }
}