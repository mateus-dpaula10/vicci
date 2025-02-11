import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantReserveComponent } from './restaurant-reserve.component';

describe('RestaurantReserveComponent', () => {
  let component: RestaurantReserveComponent;
  let fixture: ComponentFixture<RestaurantReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantReserveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestaurantReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
