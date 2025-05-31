import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSimple',
})
export class TimeSimplePipe implements PipeTransform {
  transform(value: number): unknown {
    const seconds = Math.floor(value / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
