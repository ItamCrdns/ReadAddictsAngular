import { TestBed } from '@angular/core/testing'

import { NewCommentService } from './new-comment.service'

describe('NewCommentService', () => {
  let service: NewCommentService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(NewCommentService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
