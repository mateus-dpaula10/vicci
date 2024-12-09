import { Component, inject } from '@angular/core';
import { RestaurantSauceService } from './restaurant-sauce.service';
import { RestaurantSauceModalComponent } from './restaurant-sauce-modal/restaurant-sauce-modal.component';
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

@Component({
  selector: 'restaurant-sauce',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './restaurant-sauce.component.html',
  styleUrl: './restaurant-sauce.component.scss'
})
export class RestaurantSauceComponent {
  private dialog = inject(MatDialog);
  private sauceService = inject(RestaurantSauceService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'weight', 'kcal', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  sauce$ = this.sauceService.sauce

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantSauceModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Molho adicionado", );
    })

  }
  onSubmit(id: any, name: any, weight: any, kcal:any, price: any) {
    this.sauceService.update(id, {
      name: name.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Molho atualizado", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }
  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir molho?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.sauceService.delete(id)
        .then(() => this.snackbar.open("Molho excluído", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
