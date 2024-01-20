import { TestBed } from '@angular/core/testing'

import { PatchEntityService } from './patch-entity.service'

describe('PatchEntityService', () => {
  let service: PatchEntityService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PatchEntityService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
