import { trigger, state, style, transition, animate } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { RestaurantProtService } from './restaurant-prot.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantProtModalComponent } from './restaurant-prot-modal/restaurant-prot-modal.component';

@Component({
  selector: 'restaurant-prot',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe],
  templateUrl: './restaurant-prot.component.html',
  styleUrl: './restaurant-prot.component.scss'
})
export class RestaurantProtComponent {
  private dialog = inject(MatDialog);
  private protService = inject(RestaurantProtService);
  private snackbar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'weight', 'kcal', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  prot$ = this.protService.prot

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantProtModalComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Proteína adicionada", );
    })

  }
  onSubmit(id: any, name: any, weight: any, kcal: any, price: any) {
    this.protService.update(id, {
      name: name.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Proteína atualizada", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ))
  }
  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir proteína?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.protService.delete(id)
        .then(() => this.snackbar.open("Proteína excluída", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ))
    })
  }
}
