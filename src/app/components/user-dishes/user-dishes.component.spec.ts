import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDishesComponent } from './user-dishes.component';

describe('UserDishesComponent', () => {
  let component: UserDishesComponent;
  let fixture: ComponentFixture<UserDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
