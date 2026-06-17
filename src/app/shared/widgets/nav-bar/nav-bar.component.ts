import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@pipes';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {}
