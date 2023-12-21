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
  showAlert: boolean = false
  alertMessage: string = ''
  timeoutId: number = 0

  private readonly alertValuesSubject = new Subject<IAlert>()

  setAlertValues (showAlert: boolean, alertMessage: string): void {
    this.showAlert = showAlert
    this.alertMessage = alertMessage

    // ? emit the new values
    this.alertValuesSubject.next({ showAlert, alertMessage })

    if (this.timeoutId !== 0) {
      // ? debounce the timeout (useful when user performs multiple alert triggers in a short amount of time)
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.showAlert = false

      // ? emit the hidding
      this.alertValuesSubject.next({
        showAlert: false,
        alertMessage: this.alertMessage
      })
    }, 5000)
  }

  getAlertValues (): Observable<IAlert> {
    return this.alertValuesSubject.asObservable()
  }
}
