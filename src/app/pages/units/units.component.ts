import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UnitServiceService } from './unit-service.service';
import { UnitsModalComponent } from './units-modal/units-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnitsImagesService } from './units-images.service';

@Component({
  selector: 'app-units',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, ButtonComponent, MatInputModule, FormsModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent {

  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);
  private unitsService = inject(UnitServiceService);
  private unitsImageService = inject(UnitsImagesService)

  units$ = this.unitsService.units;
  unitsImages$ = this.unitsImageService.unitsImages;

  displayedColumns: string[] = ['name', 'address', 'businessHours', 'photo'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;
  imagePreview: any;
  file: any;
  unitsImages: any;


  openDialog(): void {
    const unitRef = this.dialog.open(UnitsModalComponent);

    unitRef.afterClosed().subscribe(res => {
      if (!res) return

      this.dataSource.data.push(res)
      this.dataSource = new MatTableDataSource(this.dataSource.data)
      this.snackbar.open("Unidade criada")
    })
  }

  onSubmit(id: any, name: any, address: any, businessHours: any, photo: any) {
    this.unitsService.update(id, {
      name: name.value,
      address: address.value,
      businessHours: businessHours.value,
      photo: photo
    }, this.file)
      .then(() => this.snackbar.open("Unidade atualizada"))
      .catch(() => this.snackbar.open("Erro ao atualizar"));
  }

  onDelete(id: any, file?: File) {
    const snackbarRef = this.snackbar.open("Deseja excluir unidade?", "Excluir");
    snackbarRef.onAction().subscribe(() => {

      if (file) {
        console.log("tem file");
        this.unitsImageService.deleteAllImages(id, file)
      }
      this.unitsService.delete(id, file as File)
        .then(() => {

          this.snackbar.open("Unidade excluída")
        })
        .catch(() => this.snackbar.open("Erro ao excluir"));
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
