import { Component } from '@angular/core';

import { Navbar } from './navbar/navbar';
import { Slider } from './slider/slider';
import { Items } from './items/items';
import { Footer } from './footer/footer';


@Component({
  selector: 'app-root',
  imports: [
    Navbar,
    Slider,
    Items,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'mengty';
   onCartUpdate() {
    window.dispatchEvent(new Event('storage'));
   }
}
