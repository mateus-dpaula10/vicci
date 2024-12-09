import { trigger, state, style, transition, animate } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { RestaurantOmeletService } from './restaurant-omelet.service';
import { RestaurantOmeletModalComponent } from './restaurant-omelet-modal/restaurant-omelet-modal.component';

@Component({
  selector: 'restaurant-omelet',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './restaurant-omelet.component.html',
  styleUrl: './restaurant-omelet.component.scss'
})
export class RestaurantOmeletComponent {
  private dialog = inject(MatDialog);
  private omeletService = inject(RestaurantOmeletService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'weight', 'kcal', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  omelet$ = this.omeletService.omelet

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantOmeletModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Omelete adicionada", );
    })

  }
  onSubmit(id: any, name: any, weight: any, kcal:any ,price: any) {
    this.omeletService.update(id, {
      name: name.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Omelete atualizada", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }
  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir omelete?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.omeletService.delete(id)
        .then(() => this.snackbar.open("Omelete excluída", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
