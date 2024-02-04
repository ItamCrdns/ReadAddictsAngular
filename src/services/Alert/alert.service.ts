import { Injectable } from '@angular/core'
import { Subject, type Observable } from 'rxjs'

interface IAlert {
  showAlert: boolean
  alertMessage: string
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  show: boolean = false
  message: string = ''
  timeoutId: number = 0

  private readonly alertSubject = new Subject<IAlert>()

  popAlert (msg: string, duration: number = 5000): void {
    this.show = true
    this.message = msg

    // ? emit the new values
    this.alertSubject.next({
      showAlert: this.show,
      alertMessage: this.message
    })

    if (this.timeoutId !== 0) {
      // ? debounce the timeout (useful when user performs multiple alert triggers in a short amount of time)
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.show = false

      // ? emit the hidding
      this.alertSubject.next({
        showAlert: false,
        alertMessage: this.message
      })
    }, duration)
  }

  closeAlert (): void {
    this.show = false
    this.alertSubject.next({
      showAlert: false,
      alertMessage: this.message
    })
  }

  getAlertValues (): Observable<IAlert> {
    return this.alertSubject.asObservable()
  }
}
