import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css',
  providers: [Router]
})
export class NotfoundComponent {
  constructor(private location: Location){}
  goBack(){
    this.location.back();
  }

}
