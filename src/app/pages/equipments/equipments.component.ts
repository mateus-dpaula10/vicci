import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentsModalComponent } from './equipments-modal/equipments-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EquipmentsService } from './equipments.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equipments',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatTableModule, ButtonComponent, EquipmentsModalComponent, MatIconModule, FormsModule, MatFormFieldModule],
  templateUrl: './equipments.component.html',
  styleUrl: './equipments.component.scss'
})
export class EquipmentsComponent {
  private dialog = inject(MatDialog);
  private equipmentsService = inject(EquipmentsService);
  private snackbar = inject(MatSnackBar);
  imagePreview: any;
  file: any

  equipments$ = this.equipmentsService.equipments;

  displayedColumns: string[] = ['name', 'link', 'photo'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  openDialog(): void {
    const equipmentRef = this.dialog.open(EquipmentsModalComponent);
    equipmentRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res)
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackbar.open("Equipamento criado", );
    })
  }

  onSubmit(id: any, name: any, link: any, photo: any) {
    this.equipmentsService.update(id, {
      name: name.value,
      link: link.value,
      photo: photo
    }, this.file)
      .then(() => this.snackbar.open("Equipamento atualizado", ))
      .catch(() => this.snackbar.open("Erro ao atualizar", ));
  }

  onDelete(id: any, file?: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir equipamento?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.equipmentsService.delete(id, file as File)
        .then(() => this.snackbar.open("Equipamento excluído", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ));
    })
  }

  onImageSelected(target: any, element: any) {
    this.file = target.files[0];
    if (this.file) {
      this.generateImagePreview(this.file, element);
    }
  }

  generateImagePreview(file: File, element: any) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  cleanImagePreview() {
    this.imagePreview = null;
  }
}
