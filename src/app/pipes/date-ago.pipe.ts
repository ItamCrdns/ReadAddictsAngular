import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
  name: 'dateAgo',
  standalone: true
})
export class DateAgoPipe implements PipeTransform {
  transform (date: string): string {
    if (date !== '') {
      const dateFromDatabase = new Date(date)
      const userTimezoneOffset = dateFromDatabase.getTimezoneOffset() * 60000
      const dateLocal = new Date(
        dateFromDatabase.getTime() - userTimezoneOffset
      )

      const utcNow = new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours(),
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds()
        )
      )

      const seconds = Math.floor(
        (utcNow.getTime() - dateLocal.getTime()) / 1000
      )
      if (seconds < 29 && seconds > 0) {
        return 'Just now'
      }

      const intervals: Record<string, number> = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
      }

      let counter: number
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i])
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + i + ' ago'
          } else {
            return counter + ' ' + i + 's ago'
          }
        }
      }
    }
    return date
  }
}
