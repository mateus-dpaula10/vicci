import { Component, inject } from '@angular/core';
import { ProductsRestaurantReserveService } from '../../../services/products-restaurant-reserve.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductsRestaurantService } from '../../../services/products-restaurant.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurant-reserve',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    ButtonComponent,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './restaurant-reserve.component.html',
  styleUrl: './restaurant-reserve.component.scss'
})
export class RestaurantReserveComponent {
  private productsRestaurantReserveService = inject(ProductsRestaurantReserveService)
  // private fb = inject(FormBuilder)
  private usersService = inject(AuthService)
  private snackbar = inject(MatSnackBar)

  productsRestaurantReserve$ = this.productsRestaurantReserveService.productsReserve
  displayedColumns: string[] = ['name', 'date', 'time']
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  expandedElement: any
  user: any | null = null

  // productsRestaurantReserve: FormGroup = this.fb.group({
  //   name: ['', Validators.required],
  //   date: [null, Validators.required],
  //   time: [null, Validators.required],
  // })

  ngOnInit(): void {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.usersService.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  onSubmit(id: any, name: any, date: any, time: any) {
    this.productsRestaurantReserveService.update(id, {
      name: name.value,
      date: date.value,
      time: time.value
    })
      .then(() => this.snackbar.open("Reserva realizada com sucesso!", 'Fechar', { duration: 3000 }))
      .catch(() => this.snackbar.open("Erro ao atualizar", 'Fechar', { duration: 3000 }))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir carboidrato?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.productsRestaurantReserveService.delete(id)
        .then(() => this.snackbar.open("Produto excluído com sucesso!", 'Fechar', { duration: 3000 }))
        .catch(() => this.snackbar.open("Erro ao excluir", 'Fechar', { duration: 3000 }))
    })
  }
}
