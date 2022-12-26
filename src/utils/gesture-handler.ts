

export type TouchEventName = 'drag-horizontal' | 'drag-vertical' | 'drag-end' | 'drag-start';
export type DragDirection = 'horizontal' | 'vertical'; 
export type EventCallback = (distance: DragDistance, speed: DragSpeed) => void;
export type DragDistance = {
  x: number;
  y: number;
}
export type DragSpeed = {
  x: number;
  y: number;
}
export type GestureConfig = {
  // Number of pixels to travel before direction is determined
  measureDistance: number;
  // Axis to listen to
  axis: ('x' | 'y')[];
}

export class GestureHandler {
  subscriptions: { [key in TouchEventName]: EventCallback[] } = {
    'drag-horizontal': [],
    'drag-vertical': [],
    'drag-end': [],
    'drag-start': [],
  };

  private speed = {
    x: 0,
    y: 0
  };
  private initial = {
    x: 0,
    y: 0
  };
  private distance = {
    x: 0,
    y: 0,
  };
  private currentDirection: DragDirection | null = null;

  private config: GestureConfig = {
    measureDistance: 10,
    axis: ['x', 'y']
  }
  private container!: HTMLElement;

  constructor (element: HTMLElement) {
    let start: number = 0;
    let end: number = 0;
    this.container = element;
    element.addEventListener('touchstart', (event: any) => {
      start = new Date().getTime();
      this.initial.x = event.pageX;
      this.initial.y = event.pageY;
      this.dispatcher('drag-start');
    }, {
      passive: true
    });

    element.addEventListener('touchmove', (event: any) => {
      this.distance.x = event.pageX - this.initial.x
      this.distance.y = event.pageY - this.initial.y
      this.detector();
      if (this.currentDirection) {
        this.dispatcher(('drag-' + this.currentDirection) as TouchEventName);
      }
    });

    element.addEventListener('touchend', () => {
      end = new Date().getTime();
      const seconds = (end - start);
      this.speed.x = Math.abs(this.distance.x) / seconds;
      this.speed.y = Math.abs(this.distance.y) / seconds;
  
      this.initial.x = 0;
      this.initial.y = 0;
      this.currentDirection = null;
      this.container.style.overflowY = 'scroll';
      this.dispatcher('drag-end');
    }, {
      passive: true
    });
  }

  public on (event: TouchEventName, callback: (distance: DragDistance, speed: DragSpeed) => void) {
    this.subscriptions[event].push(callback)
  }

  private detector() {
    if (Math.abs(this.distance.x) > this.config.measureDistance && !this.currentDirection && this.config.axis.indexOf('x') > -1) {
      this.currentDirection = 'horizontal';
      this.container.style.overflowY = 'hidden';
    }
    if (Math.abs(this.distance.y) > this.config.measureDistance && !this.currentDirection && this.config.axis.indexOf('y') > -1) {
      this.currentDirection = 'vertical';
    }
  }

  private dispatcher(eventType: TouchEventName) {
    this.subscriptions[eventType].forEach((callback) => {
      callback(this.distance, this.speed);
    });
  }
}