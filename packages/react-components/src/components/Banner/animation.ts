class AnimationController {
  private progressPaused: boolean = false;
  private transitionPaused: boolean = false;
  private progressStart: number = 0;
  private transitionStart: number = 0;
  private progressLastTime: number = 0;
  private transitionLastTime: number = 0;
  private running: boolean = false;
  private timeoutId: number | null = null;
  private progressAnimationFrameId: number | null = null;
  private transitionAnimationFrameId: number | null = null;

  constructor(
    public readonly duration: number,
    public callbackTransition: () => void,
    public callbackProgress: (value: number) => void
  ) {}

  public startAnimations(): void {
    this.progressStart = performance.now();
    this.transitionStart = performance.now();

    if (!this.running) {
      this.running = true;
      this.progressAnimationFrameId = requestAnimationFrame(this.animateProgress);
      this.transitionAnimationFrameId = requestAnimationFrame(this.animateTransition);
      this.timeoutId = window.setTimeout(() => {
        console.log('Executando evento após 5000 ms');
        this.callbackTransition();
      }, this.duration);
    }
  }

  private animateProgress(timestamp: number)  {
    if (this.progressPaused) return;

    const elapsedTime = timestamp - this.progressStart;
    if (elapsedTime < this.duration) {
      if (elapsedTime - this.progressLastTime >= 100) {
        this.progressLastTime = elapsedTime;
        const progress = Math.floor((elapsedTime / this.duration) * 100);
        this.callbackProgress(progress);
      }
      this.progressAnimationFrameId = requestAnimationFrame(this.animateProgress);
    } else {
      console.log('Progress animation completed');
      this.restartAnimations();
    }
  };

  private animateTransition(timestamp: number) {
    if (this.transitionPaused) return;

    const elapsedTime = timestamp - this.transitionStart;
    if (elapsedTime < this.duration) {
      if (elapsedTime - this.transitionLastTime >= 100) {
        // console.log(`Transition animation step at ${elapsedTime.toFixed(0)} ms`);
        this.transitionLastTime = elapsedTime;
      }
      this.transitionAnimationFrameId = requestAnimationFrame(this.animateTransition);
    } else {
      // console.log('Transition animation completed');
      this.restartAnimations();
    }
  };


  private restartAnimations(): void {
    this.clearAnimations();
    this.startAnimations();
  }

  

  public pauseAnimations(): void {
    if (this.running) {
      this.progressPaused = true;
      this.transitionPaused = true;
      this.running = false;
    }
  }

  public resumeAnimations(): void {
    if (!this.running) {
      this.progressPaused = false;
      this.transitionPaused = false;
      this.startAnimations();
    }
  }

  public clearAnimations(): void {
    this.progressStart = 0; 
    this.transitionStart = 0;
    this.running = false;
    this.progressPaused = false;
    this.transitionPaused = false;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.progressAnimationFrameId !== null) {
      cancelAnimationFrame(this.progressAnimationFrameId);
      this.progressAnimationFrameId = null;
    }
    if (this.transitionAnimationFrameId !== null) {
      cancelAnimationFrame(this.transitionAnimationFrameId);
      this.transitionAnimationFrameId = null;
    }
  }
}

export { AnimationController };