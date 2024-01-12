import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  forwardRef,
  inject
} from '@angular/core'
import { CharacterCountService } from '../../services/Character count/character-count.service'
import {
  type ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type Validator,
  type ValidationErrors,
  FormsModule
} from '@angular/forms'
import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
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
  @Input() inputBgColor: string = 'whitesmoke'
  @Input() showCharacterCount: boolean = true
  @Input() type: string = 'text'
  @Input() maxLength: number = 255
  @Input() sizeModifier: string = '' // Pass a number between 0 and 1rem (e.g. 0.5rem) to reduce the size of the input
  @Input() fontSize: string = '' // If we modify the size we might also want to modify the font size

  @Output() modelChange = new EventEmitter<string>()

  inputValue: string = ''
  characterCount: number = 0
  characterCountService = inject(CharacterCountService)

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService
  ) {
    this.characterCount = this.characterCountService.characterCount
  }

  updateCharacterInfo (inputText: string): void {
    this.characterCount = inputText.length
    this.inputValue = inputText
    this.modelChange.emit(this.inputValue)

    if (inputText.length >= this.maxLength) {
      this.alertService.setAlertValues(
        true,
        'Maximum character count of ' + this.maxLength + ' exceeded'
      )
    }
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

  clear (): void {
    this.inputValue = ''
    this.characterCount = 0
  }
}
