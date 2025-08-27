import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@pipes';
import { LetterHoverDirective } from '@directives';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, TranslatePipe, LetterHoverDirective],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {}
