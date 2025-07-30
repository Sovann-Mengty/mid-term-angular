import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  imports: [
    CommonModule
  ],
  templateUrl: './slider.html',
  styleUrl: './slider.css'
})
export class Slider {
  currentSlide = 0;
  private interval: any;
  
  slides = [
    {
      image: '/imgitem/slider1.jpg',
      title: 'Summer Collection',
      description: 'Discover our latest sustainable fashion pieces',
      alt: 'Summer Collection'
    },
    {
      image: '/imgitem/slider2.jpg',
      title: 'Eco-Friendly Materials',
      description: 'Made with love for the planet',
      alt: 'Eco-Friendly Materials'
    },
    {
      image: '/imgitem/slider3.jpg',
      title: 'Free Shipping',
      description: 'On orders over $50',
      alt: 'Free Shipping'
    }
  ];
  
  ngOnInit() {
    this.startAutoSlide();
  }
  
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  startAutoSlide() {
    this.interval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }
  
  goToSlide(index: number) {
    this.currentSlide = index;
  }

}
