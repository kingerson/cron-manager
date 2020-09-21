import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemcomponentComponent } from './itemcomponent.component';

describe('ItemcomponentComponent', () => {
  let component: ItemcomponentComponent;
  let fixture: ComponentFixture<ItemcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
