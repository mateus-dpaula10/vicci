import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RestaurantCarboComponent } from './restaurant-carbo/restaurant-carbo.component';
import { RestaurantProtComponent } from './restaurant-prot/restaurant-prot.component';
import { RestaurantOmeletComponent } from './restaurant-omelet/restaurant-omelet.component';
import { RestaurantSaladComponent } from './restaurant-salad/restaurant-salad.component';
import { RestaurantSauceComponent } from './restaurant-sauce/restaurant-sauce.component';
import { RestaurantBeverageComponent } from './restaurant-beverage/restaurant-beverage.component';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [
    MatTabsModule, RestaurantCarboComponent, RestaurantProtComponent,
    RestaurantOmeletComponent, RestaurantSaladComponent, RestaurantSauceComponent,
    RestaurantBeverageComponent
  ],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss'
})
export class RestaurantComponent {

}
