import { TestBed } from '@angular/core/testing'

import { GetConversationService } from './get-conversation.service'

describe('GetConversationService', () => {
  let service: GetConversationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GetConversationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
