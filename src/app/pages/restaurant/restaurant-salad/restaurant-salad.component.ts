import { Component, inject } from '@angular/core';
import { RestaurantSaladService } from './restaurant-salad.service';
import { RestaurantSaladModalComponent } from './restaurant-salad-modal/restaurant-salad-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'restaurant-salad',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './restaurant-salad.component.html',
  styleUrl: './restaurant-salad.component.scss'
})
export class RestaurantSaladComponent {
  private dialog = inject(MatDialog);
  private saladService = inject(RestaurantSaladService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'weight', 'kcal', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  salad$ = this.saladService.salad

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantSaladModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Salada adicionada", );
    })

  }
  onSubmit(id: any, name: any, weight: any, kcal: any, price: any) {
    this.saladService.update(id, {
      name: name.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Salada atualizada", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }
  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir salada?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.saladService.delete(id)
        .then(() => this.snackbar.open("Salada excluída", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
