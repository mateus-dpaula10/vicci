import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RestaurantBeverageService } from './restaurant-beverage.service';
import { RestaurantBeverageModalComponent } from './restaurant-beverage-modal/restaurant-beverage-modal.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';

@Component({
  selector: 'restaurant-beverage',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './restaurant-beverage.component.html',
  styleUrl: './restaurant-beverage.component.scss'
})
export class RestaurantBeverageComponent {
  private dialog = inject(MatDialog);
  private beverageService = inject(RestaurantBeverageService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'weight', 'kcal', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  beverage$ = this.beverageService.beverage

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantBeverageModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Bebida adicionada", );
    })

  }
  onSubmit(id: any, name: any, weight: any, kcal: any, price: any) {
    this.beverageService.update(id, {
      name: name.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Bebida atualizada", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }
  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir bebida?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.beverageService.delete(id)
        .then(() => this.snackbar.open("Bebida excluída", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
