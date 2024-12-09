import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PlansService } from './plans.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansModalComponent } from './plans-modal/plans-modal.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-plans',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, PlansModalComponent, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent {

  private dialog = inject(MatDialog);
  private plansService = inject(PlansService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'price', 'days'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  plans$ = this.plansService.plans

  openDialog() {
    const dialogRef = this.dialog.open(PlansModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Plano criado");
    })

  }
  onSubmit(id: any, name: any, price: any, days: any) { 
    this.plansService.update(id, {
      name: name.value,
      price: price.value,
      days: days.value
    })
    .then(() => this.snackbar.open("Plano atualizado", ))
    .catch(() => this.snackbar.open("Erro ao atualizar", ))
}
  onDelete(id: any) { 
    const snackbarRef = this.snackbar.open("Deseja excluir plano?", "Excluir", {duration: 3000})
    snackbarRef.onAction().subscribe(() => {
      this.plansService.delete(id)
      .then(() => this.snackbar.open("Plano excluído"))
      .catch(() => this.snackbar.open("Erro ao excluir"))
    })
  }
}
