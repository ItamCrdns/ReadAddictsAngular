import { TestBed } from '@angular/core/testing'

import { GetEntityService } from './get-entity.service'

describe('GetEntityService', () => {
  let service: GetEntityService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GetEntityService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
