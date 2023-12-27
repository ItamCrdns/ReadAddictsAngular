import { TestBed } from '@angular/core/testing'

import { GetCommentService } from './get-comment.service'

describe('GetCommentService', () => {
  let service: GetCommentService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GetCommentService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
