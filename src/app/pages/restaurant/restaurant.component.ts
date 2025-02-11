import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductsRestaurantService } from '../../services/products-restaurant.service';
import { RestaurantModalComponent } from './restaurant-modal/restaurant-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RestaurantModalReserveComponent } from './restaurant-modal-reserve/restaurant-modal-reserve.component';
import { RestaurantReserveComponent } from "./restaurant-reserve/restaurant-reserve.component";

@Component({
  selector: 'app-restaurant',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    MatTabsModule, ButtonComponent, MatIconModule, MatFormFieldModule,
    MatInputModule, MatTableModule, FormsModule, MatSelectModule, MatButtonModule,
    NgxMaskDirective, RestaurantReserveComponent
],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
  providers: [provideNgxMask()]
})
export class RestaurantComponent {
  private usersService = inject(AuthService)
  private dialog = inject(MatDialog)
  private snackbar = inject(MatSnackBar)
  private productsRestaurantService = inject(ProductsRestaurantService)

  displayedColumns: string[] = ['name', 'category', 'weight', 'kcal', 'price']
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  expandedElement: any
  user: any | null = null
  productsRestaurant$ = this.productsRestaurantService.products
  productsRestaurantCategories: any[] = ['Bebida', 'Carboidrato', 'Mix de saladas', 'Molho', 'Omelete orgânico', 'Proteína']

  productsRestaurantBeverage$ = this.productsRestaurant$.pipe(
    map(products => products.filter(product => product.category === 'Bebida'))
  )
  productsRestaurantCarbohydrate$ = this.productsRestaurant$.pipe(
    map(products => products.filter(product => product.category === 'Carboidrato'))
  )
  productsRestaurantSalad$ = this.productsRestaurant$.pipe(
    map(products => products.filter(product => product.category === 'Mix de saladas'))
  )
  productsRestaurantSauce$ = this.productsRestaurant$.pipe(
    map(products => products.filter(product => product.category === 'Molho'))
  )
  productsRestaurantOmelet$ = this.productsRestaurant$.pipe(
    map(products => products.filter(product => product.category === 'Omelete orgânico'))
  )
  productsRestaurantProtein$ = this.productsRestaurant$.pipe(
    map(products => products.filter(product => product.category === 'Proteína'))
  )  

  tabs: any[] = [
    { label: 'Bebidas', content: this.productsRestaurantBeverage$ },
    { label: 'Carboidratos', content: this.productsRestaurantCarbohydrate$ },
    { label: 'Mix de saladas', content: this.productsRestaurantSalad$ },
    { label: 'Omelete orgânico', content: this.productsRestaurantOmelet$ },
    { label: 'Proteína', content: this.productsRestaurantProtein$ },
  ]

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

  openDialog() {
    const dialogRef = this.dialog.open(RestaurantModalComponent)

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res)
      this.dataSource = new MatTableDataSource(this.dataSource.data)
      this.snackbar.open("Produto adicionado com sucesso!", 'Fechar', { duration: 3000 })
    })
  }

  openDialogReserve() {
    const dialogRef = this.dialog.open(RestaurantModalReserveComponent)

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res)
      this.dataSource = new MatTableDataSource(this.dataSource.data)
      this.snackbar.open("Reserva realizada com sucesso!", 'Fechar', { duration: 3000 })
    })
  }

  onSubmit(id: any, name: any, category: any, weight: any, kcal: any, price: any) {
    this.productsRestaurantService.update(id, {
      name: name.value,
      category: category.value,
      weight: weight.value,
      kcal: kcal.value,
      price: price.value
    })
      .then(() => this.snackbar.open("Produto atualizado com sucesso!", 'Fechar', { duration: 3000 }))
      .catch(() => this.snackbar.open("Erro ao atualizar", 'Fechar', { duration: 3000 }))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir carboidrato?", "Excluir", { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.productsRestaurantService.delete(id)
        .then(() => this.snackbar.open("Produto excluído com sucesso!", 'Fechar', { duration: 3000 }))
        .catch(() => this.snackbar.open("Erro ao excluir", 'Fechar', { duration: 3000 }))
    })
  }
}
