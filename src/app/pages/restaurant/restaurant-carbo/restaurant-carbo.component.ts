import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantCarboModalComponent } from './restaurant-carbo-modal/restaurant-carbo-modal.component';
import { RestaurantCarboService } from './restaurant-carbo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'restaurant-carbo',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './restaurant-carbo.component.html',
  styleUrl: './restaurant-carbo.component.scss'
})
export class RestaurantCarboComponent {
  private dialog = inject(MatDialog);
  private carboService = inject(RestaurantCarboService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'weight', 'kcal', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  carbo$ = this.carboService.carbo

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantCarboModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Carboidrato adicionado", );
    })

  }
  onSubmit(id: any, name: any, weight: any, kcal: any, price: any) {
    this.carboService.update(id, {
      name: name.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Carboidrato atualizado", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }
  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir carboidrato?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.carboService.delete(id)
        .then(() => this.snackbar.open("Carboidrato excluído", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
