import { TestBed } from '@angular/core/testing'

import { NewEntityService } from './new-entity.service'

describe('NewEntityService', () => {
  let service: NewEntityService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(NewEntityService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
