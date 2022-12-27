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
