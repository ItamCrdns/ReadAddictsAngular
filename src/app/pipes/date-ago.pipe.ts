import { type OnDestroy, Pipe, type PipeTransform } from '@angular/core'

@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: false
})
export class DateAgoPipe implements PipeTransform, OnDestroy {
  private intervalId: number = 0

  ngOnDestroy (): void {
    this.clear()
  }

  transform (date: string): string {
    this.clear()

    this.intervalId = setInterval(() => {
      this.calculateTime(date)
    }, 60000) // 1 minute

    return this.calculateTime(date)
  }

  private clear (): void {
    if (this.intervalId !== 0) {
      clearInterval(this.intervalId)
    }
  }

  private calculateTime (date: string): string {
    const currentDate = new Date()
    const inputDate = new Date(date)

    const timeDiff = currentDate.getTime() - inputDate.getTime()
    const seconds = Math.floor(timeDiff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    if (months > 12) {
      return 'Too long ago'
    }

    if (months > 0) {
      return months === 1 ? '1 month ago' : months + ' months ago'
    }

    if (days > 0) {
      return days === 1 ? '1 day ago' : days + ' days ago'
    }

    if (hours > 0) {
      return hours === 1 ? '1 hour ago' : hours + ' hours ago'
    }

    if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : minutes + ' minutes ago'
    }

    if (seconds > 30) {
      return seconds === 31 ? '31 seconds ago' : seconds + ' seconds ago'
    }

    return 'Just now'
  }
}
