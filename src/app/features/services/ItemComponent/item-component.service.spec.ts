import { TestBed } from '@angular/core/testing';

import { ItemComponentService } from './item-component.service';

describe('ItemComponentService', () => {
  let service: ItemComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
