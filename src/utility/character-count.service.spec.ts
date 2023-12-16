import { TestBed } from '@angular/core/testing';

import { CharacterCountService } from './character-count.service';

describe('CharacterCountService', () => {
  let service: CharacterCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
