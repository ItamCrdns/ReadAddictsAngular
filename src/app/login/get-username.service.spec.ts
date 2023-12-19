import { TestBed } from '@angular/core/testing'

import { GetusernameService } from '../getusername.service'

describe('GetusernameService', () => {
  let service: GetusernameService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GetusernameService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
