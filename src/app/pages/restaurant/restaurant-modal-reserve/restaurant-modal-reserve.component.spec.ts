import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantModalReserveComponent } from './restaurant-modal-reserve.component';

describe('RestaurantModalReserveComponent', () => {
  let component: RestaurantModalReserveComponent;
  let fixture: ComponentFixture<RestaurantModalReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantModalReserveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestaurantModalReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
