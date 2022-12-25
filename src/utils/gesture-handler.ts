

export type TouchEventName = 'drag-horizontal' | 'drag-vertical' | 'drag-end' | 'drag-start';
export type DragDirection = 'horizontal' | 'vertical'; 
export type EventCallback = (distance: DragDistance) => void;
export type DragDistance = {
  x: number;
  y: number;
}
export type GestureConfig = {
  measureDistance: number;
  axis: ('x' | 'y')[];
}

export class GestureHandler {


  subscriptions: { [key in TouchEventName]: EventCallback[] } = {
    'drag-horizontal': [],
    'drag-vertical': [],
    'drag-end': [],
    'drag-start': [],
  };

  private _config: GestureConfig = {
    measureDistance: 8,
    axis: ['x', 'y']
  }
  private initial = {
    x: 0,
    y: 0
  };
  private current = {
    x: 0,
    y: 0,
  };
  private currentDirection: DragDirection | null = null;

  constructor (element: HTMLElement, config?: GestureConfig) {
    element.addEventListener('touchstart', (event: any) => {
      this.initial.x = event.pageX;
      this.initial.y = event.pageY;
      this.dispatcher('drag-start', this.current);
    }, {
      passive: true
    });

    element.addEventListener('touchmove', (event: any) => {
      this.current.x = event.pageX - this.initial.x
      this.current.y = event.pageY - this.initial.y
      this.detector();
      if (this.currentDirection) {
        this.dispatcher(('drag-' + this.currentDirection) as TouchEventName, this.current);
      }
    }, {
      passive: true
    });

    element.addEventListener('touchend', () => {
      this.initial.x = 0;
      this.initial.y = 0;
      this.currentDirection = null;
      this.dispatcher('drag-end', this.current);
    }, {
      passive: true
    });

    if (config) {
      this._config = config;
    }
  }

  public on (event: TouchEventName, callback: (event: any) => void) {
    this.subscriptions[event].push(callback)
  }

  private detector() {
    if (Math.abs(this.current.x) > 8 && !this.currentDirection) {
      this.currentDirection = 'horizontal';

    }
    if (Math.abs(this.current.y) > 8 && !this.currentDirection) {
      this.currentDirection = 'vertical';
    }
  }

  private dispatcher(eventType: TouchEventName, distance: DragDistance) {
    this.subscriptions[eventType].forEach((callback) => {
      callback(distance);
    });
  }
}