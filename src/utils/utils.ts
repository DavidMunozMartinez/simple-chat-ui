export const ShortTimeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });
export const ShortDateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium'});
export const RelativeDateFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

export class MediaQueryListener {

  matches: boolean = false;
  
  private subscriptions: ((state: boolean) => void)[] = [];
  private media: MediaQueryList;

  constructor(query: string) {
    this.media = window.matchMedia(query);
    this.matches = this.media.matches;
    this.media.onchange = (event: MediaQueryListEvent) => {
      this.matches = event.matches;
      this.subscriptions.forEach((callback) => {
        callback(event.matches);
      });
    }
  }

  onChange(callback: (state: boolean) => void) {
    this.subscriptions.push(callback)
  }
}

export const DesktopMediaQuery = new MediaQueryListener('only screen and (min-width: 700px)');
export const MobileMediaQuery = new MediaQueryListener('only screen and (max-width: 700px)');

export function prettyDate(date: Date): string {
  let day = date.getTime();
  let now = new Date().getTime();

  let Difference_In_Days = Math.round((day - now) / (1000 * 3600 * 24));

  return RelativeDateFormatter.format(Difference_In_Days, 'day');
}
