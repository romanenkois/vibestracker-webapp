// letter-hover.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy, AfterContentInit } from '@angular/core';

export type LetterHoverEffect = 'scale' | '3d' | 'bounce' | 'glow' | 'flip';

@Directive({
  selector: '[appLetterHover]',
  standalone: true,
})
export class LetterHoverDirective implements OnInit, OnDestroy, AfterContentInit {
  @Input() appLetterHover: LetterHoverEffect = 'scale';
  hoverColor?: string;
  animationDuration: string = '0.3s';
  preserveSpaces: boolean = true;

  private originalContent: string = '';
  private spans: HTMLElement[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    // this.setupLetterHover();
    // this.addStyles();
  }

  ngAfterContentInit() {
    this.setupLetterHover();
    this.addStyles();
  }

  ngOnDestroy() {
    // Cleanup if needed
    this.spans = [];
  }

  private setupLetterHover() {
    const element = this.el.nativeElement;
    this.originalContent = element.textContent || '';

    // Clear the element
    element.innerHTML = '';

    // Add base class for the effect
    this.renderer.addClass(element, `letter-hover-${this.appLetterHover}`);
    this.renderer.setStyle(element, 'cursor', 'default');
    this.renderer.setStyle(element, 'display', 'inline-block');

    // Wrap each character in a span
    this.originalContent.split('').forEach((char, index) => {
      if (char === ' ' && this.preserveSpaces) {
        // Add space as text node
        const textNode = this.renderer.createText(' ');
        this.renderer.appendChild(element, textNode);
      } else if (char !== ' ') {
        const span = this.renderer.createElement('span');
        const text = this.renderer.createText(char);

        this.renderer.appendChild(span, text);
        this.renderer.appendChild(element, span);

        // Set base span styles
        this.renderer.setStyle(span, 'display', 'inline-block');
        this.renderer.setStyle(
          span,
          'transition',
          `all ${this.animationDuration} cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
        );
        this.renderer.setStyle(span, 'position', 'relative');

        // Add hover listeners
        this.addHoverListeners(span);
        this.spans.push(span);
      }
    });
  }

  private addHoverListeners(span: HTMLElement) {
    this.renderer.listen(span, 'mouseenter', () => {
      this.applyHoverEffect(span, true);
    });

    this.renderer.listen(span, 'mouseleave', () => {
      this.applyHoverEffect(span, false);
    });
  }

  private applyHoverEffect(span: HTMLElement, isHover: boolean) {
    if (!isHover) {
      // Reset styles
      this.renderer.removeStyle(span, 'transform');
      // this.renderer.removeStyle(span, 'color');
      // this.renderer.removeStyle(span, 'text-shadow');
      // this.renderer.removeStyle(span, 'filter');
      // this.renderer.removeStyle(span, 'animation');
      return;
    }

    // Apply color if specified
    if (this.hoverColor) {
      this.renderer.setStyle(span, 'color', this.hoverColor);
    }

    // Apply effect based on type
    switch (this.appLetterHover) {
      case 'scale':
        this.renderer.setStyle(span, 'transform', 'scale(1.3) translateY(-10px)');
        break;

      case '3d':
        this.renderer.setStyle(span, 'transform', 'rotateY(360deg) scale(1.2)');;
        this.renderer.setStyle(span, 'transition', `all 0.4s ease`);
        break;

      case 'bounce':
        this.renderer.setStyle(span, 'animation', 'letterBounce 0.6s ease');
        this.renderer.setStyle(span, 'text-shadow', '0 5px 20px rgba(78, 205, 196, 0.4)');
        break;

      case 'glow':
        this.renderer.setStyle(span, 'transform', 'translateY(-8px)');
        this.renderer.setStyle(
          span,
          'text-shadow',
          '0 0 10px rgba(168, 230, 207, 0.8), 0 0 20px rgba(168, 230, 207, 0.6), 0 0 30px rgba(168, 230, 207, 0.4)',
        );
        this.renderer.setStyle(span, 'filter', 'brightness(1.2)');
        break;

      case 'flip':
        this.renderer.setStyle(span, 'transform', 'rotateX(360deg) scale(1.15)');
        this.renderer.setStyle(span, 'text-shadow', '0 10px 25px rgba(0,0,0,0.3)');
        this.renderer.setStyle(span, 'transition', `all 0.5s ease`);
        break;
    }
  }

  private addStyles() {
    // Check if styles are already added
    if (document.getElementById('letter-hover-styles')) {
      return;
    }

    const style = this.renderer.createElement('style');
    this.renderer.setAttribute(style, 'id', 'letter-hover-styles');

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

    this.renderer.appendChild(style, this.renderer.createText(css));
    this.renderer.appendChild(document.head, style);
  }
}

// Usage examples in component:

/*
// app.component.ts
import { Component } from '@angular/core';
import { LetterHoverDirective } from './letter-hover.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LetterHoverDirective],
  template: `
    <div class="demo-container">
      <h1>Angular Letter Hover Effects</h1>

      <div class="demo-section">
        <h2 appLetterHover="scale">Hover over me!</h2>
      </div>

      <div class="demo-section">
        <p appLetterHover="3d" hoverColor="#FF6B6B">3D Rotation Effect</p>
      </div>

      <div class="demo-section">
        <span appLetterHover="bounce" animationDuration="0.4s">Bouncy Letters</span>
      </div>

      <div class="demo-section">
        <h3 appLetterHover="glow" hoverColor="#00FF88">Glowing Text</h3>
      </div>

      <div class="demo-section">
        <p appLetterHover="flip" hoverColor="#FF69B4">Flip Effect</p>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: white;
      font-family: 'Arial', sans-serif;
    }

    .demo-section {
      margin: 30px 0;
      text-align: center;
    }

    h1 { font-size: 2.5em; margin-bottom: 50px; text-align: center; }
    h2 { font-size: 2.2em; }
    h3 { font-size: 2em; }
    p { font-size: 1.8em; }
    span { font-size: 1.8em; }
  `]
})
export class AppComponent {
  title = 'letter-hover-demo';
}
*/
