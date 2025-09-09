// letter-hover.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy, AfterContentInit, inject } from '@angular/core';

export type LetterHoverEffect = 'scale' | '3d' | 'bounce' | 'glow' | 'flip';

@Directive({
  selector: '[appLetterHover]',
  standalone: true,
})
export class LetterHoverDirective implements OnInit, OnDestroy, AfterContentInit {
  // private readonly _elementRef = inject(ElementRef);
  // private readonly _renderer2 = inject(Renderer2);

  @Input() appLetterHover: LetterHoverEffect = 'scale';
  animationDuration: string = '0.3s';
  preserveSpaces: boolean = true;

  private originalContent: string = '';
  private spans: HTMLElement[] = [];

  constructor(
    private _elementRef: ElementRef,
    private _renderer2: Renderer2,
  ) {}

  ngOnInit() {
    this.setupLetterHover();
    this.addStyles();
  }

  ngAfterContentInit() {
    // this.setupLetterHover();
    // this.addStyles();
  }

  ngOnDestroy() {
    // Cleanup if needed
    this.spans = [];
  }

  private setupLetterHover() {
    const element = this._elementRef.nativeElement;
    this.originalContent = element.textContent || '';

    // Clear the element
    element.innerHTML = '';

    // Add base class for the effect
    this._renderer2.addClass(element, `letter-hover-${this.appLetterHover}`);
    this._renderer2.setStyle(element, 'cursor', 'default');
    this._renderer2.setStyle(element, 'display', 'inline-block');

    // Wrap each character in a span
    this.originalContent.split('').forEach((char, index) => {
      if (char === ' ' && this.preserveSpaces) {
        // Add space as text node
        const textNode = this._renderer2.createText(' ');
        this._renderer2.appendChild(element, textNode);
      } else if (char !== ' ') {
        const span = this._renderer2.createElement('span');
        const text = this._renderer2.createText(char);

        this._renderer2.appendChild(span, text);
        this._renderer2.appendChild(element, span);

        // Set base span styles
        this._renderer2.setStyle(span, 'display', 'inline-block');
        // this._renderer2.setStyle(
        //   span,
        //   'transition',
        //   `all ${this.animationDuration} cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
        // );
        this._renderer2.setStyle(span, 'position', 'relative');

        // Add hover listeners
        this.addHoverListeners(span);
        this.spans.push(span);
      }
    });
  }

  private addHoverListeners(span: HTMLElement) {
    this._renderer2.listen(span, 'mouseenter', () => {
      this.applyHoverEffect(span, true);
    });

    this._renderer2.listen(span, 'mouseleave', () => {
      this.applyHoverEffect(span, false);
    });
  }

  private applyHoverEffect(span: HTMLElement, isHover: boolean) {
    if (!isHover) {
      // Reset styles
      this._renderer2.removeStyle(span, 'transform');
      // this._renderer2.removeStyle(span, 'color');
      // this._renderer2.removeStyle(span, 'text-shadow');
      // this._renderer2.removeStyle(span, 'filter');
      // this._renderer2.removeStyle(span, 'animation');
      return;
    }

    // Apply effect based on type
    switch (this.appLetterHover) {
      case 'scale':
        this._renderer2.setStyle(span, 'transform', 'scale(1.3) translateY(-10px)');
        break;

      case '3d':
        this._renderer2.setStyle(span, 'transform', 'rotateY(360deg) scale(1.2)');
        this._renderer2.setStyle(span, 'transition', `all 0.4s ease`);
        break;

      case 'bounce':
        this._renderer2.setStyle(span, 'animation', 'letterBounce 0.6s ease');
        this._renderer2.setStyle(span, 'text-shadow', '0 5px 20px rgba(78, 205, 196, 0.4)');
        break;

      case 'glow':
        this._renderer2.setStyle(span, 'transform', 'translateY(-8px)');
        this._renderer2.setStyle(
          span,
          'text-shadow',
          '0 0 10px rgba(168, 230, 207, 0.8), 0 0 20px rgba(168, 230, 207, 0.6), 0 0 30px rgba(168, 230, 207, 0.4)',
        );
        this._renderer2.setStyle(span, 'filter', 'brightness(1.2)');
        break;

      case 'flip':
        this._renderer2.setStyle(span, 'transform', 'rotateX(360deg) scale(1.15)');
        this._renderer2.setStyle(span, 'text-shadow', '0 10px 25px rgba(0,0,0,0.3)');
        this._renderer2.setStyle(span, 'transition', `all 0.5s ease`);
        break;
    }
  }

  private addStyles() {
    // Check if styles are already added
    if (document.getElementById('letter-hover-styles')) {
      return;
    }

    const style = this._renderer2.createElement('style');
    this._renderer2.setAttribute(style, 'id', 'letter-hover-styles');

    const css = `
      @keyframes letterBounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px) scale(1.1); }
        60% { transform: translateY(-10px) scale(1.05); }
      }

      .letter-hover-3d {
        perspective: 1000px;
      }

      .letter-hover-3d span {
        transform-style: preserve-3d;
      }

      .letter-hover-flip {
        perspective: 1000px;
      }

      .letter-hover-flip span {
        transform-style: preserve-3d;
      }
    `;

    this._renderer2.appendChild(style, this._renderer2.createText(css));
    this._renderer2.appendChild(document.head, style);
  }
}
