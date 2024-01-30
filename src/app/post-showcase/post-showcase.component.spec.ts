import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { PostShowcaseComponent } from './post-showcase.component'

describe('PostShowcaseComponent', () => {
  let component: PostShowcaseComponent
  let fixture: ComponentFixture<PostShowcaseComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostShowcaseComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(PostShowcaseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
