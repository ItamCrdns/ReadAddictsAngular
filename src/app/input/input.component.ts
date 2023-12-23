import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  inject
} from '@angular/core'
import { CharacterCountService } from '../../services/character-count.service'
import {
  type ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type Validator,
  type ValidationErrors
} from '@angular/forms'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    // ! You must register an `NgValueAccessor` with a custom form control
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, Validator {
  @Input() labelText: string = 'Set a default text...'
  @Input() labelBackgroundColor: string = 'white'
  @Input() showCharacterCount: boolean = true
  @Input() type: string = 'text'
  @Input() maxLength: number = 255

  @Output() modelChange = new EventEmitter<string>()

  inputValue: string = ''
  characterCount: number = 0
  characterCountService = inject(CharacterCountService)

  constructor () {
    this.characterCount = this.characterCountService.characterCount
  }

  incrementCharacterCount (inputText: string): void {
    this.characterCount = inputText.length
    this.inputValue = inputText
    this.modelChange.emit(this.inputValue)
  }

  writeValue (obj: any): void {
    this.inputValue = obj
  }

  registerOnChange (fn: any): void {
    this.modelChange.subscribe(fn)
  }

  registerOnTouched (fn: any): void {
    //
  }

  validate (): ValidationErrors | null {
    if (this.inputValue === '') {
      return { required: true }
    }
    return null
  }
}
