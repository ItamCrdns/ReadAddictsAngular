import { TestBed } from '@angular/core/testing'

import { GetRecentMessageSendersService } from './get-recent-message-senders.service'

describe('GetRecentMessageSendersService', () => {
  let service: GetRecentMessageSendersService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GetRecentMessageSendersService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
