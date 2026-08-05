import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [MatCard,MatCardTitle, MatCardContent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
