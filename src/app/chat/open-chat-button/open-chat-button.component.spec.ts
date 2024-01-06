import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenChatButtonComponent } from './open-chat-button.component';

describe('OpenChatButtonComponent', () => {
  let component: OpenChatButtonComponent;
  let fixture: ComponentFixture<OpenChatButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenChatButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenChatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
