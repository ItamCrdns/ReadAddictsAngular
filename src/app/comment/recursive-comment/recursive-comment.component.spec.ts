import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveCommentComponent } from './recursive-comment.component';

describe('RecursiveCommentComponent', () => {
  let component: RecursiveCommentComponent;
  let fixture: ComponentFixture<RecursiveCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursiveCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecursiveCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
