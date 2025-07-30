import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity?: number; // optional for cart
}



@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items.html',
  styleUrls: ['./items.css']
})
export class Items implements OnInit {
  @Output() addToCartEvent = new EventEmitter<void>();

  products: Product[] = [];

  ngOnInit() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      this.products = await res.json();
    } catch (error) {
      console.error('Failed to fetch products', error);
      Swal.fire('Error', 'Failed to load products.', 'error');
    }
  }

  addToCart(product: any) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const existingItem = cart.find((item: any) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      img: product.image // ✅ Fix image key here
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('storage'));

  Swal.fire({
    icon: 'success',
    title: 'Added to Cart',
    text: `${product.title} has been added!`,
    timer: 1200,
    showConfirmButton: false
  });
}

    
  
}
