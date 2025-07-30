import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule]
})
export class Navbar implements OnInit {
  cartCount: number = 0;

  ngOnInit() {
    this.updateCartCount();
    window.addEventListener('storage', () => this.updateCartCount());
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.length;
  }

  openCartPopup() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.map((item: any) => ({ ...item, quantity: item.quantity || 1 }));

    const updateCartInStorage = () => {
      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartCount();
    };

    const calculateTotal = () => {
      return cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    };

    const renderCartHtml = () => {
      return cart.map((item: any, index: number) => `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px;">
          <div style="display:flex;align-items:center;">
            <img src="${item.img}" width="50" height="50" style="object-fit:contain;margin-right:10px;border-radius:5px;" />
            <div>
              <strong>${item.title}</strong><br/>
              <span style="font-size:14px;color:#555;">
                $${item.price} × ${item.quantity} = 
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong><br/>
                <span style="color:#888;font-size:13px;">៛${((item.price * item.quantity) * 4100).toLocaleString()}</span>
              </span>
              <div style="margin-top:6px;">
                <button class="qty-btn" data-index="${index}" data-action="decrease"
                  style="width:28px;height:28px;border:none;border-radius:5px;background:#eee;color:#333;margin-right:5px;cursor:pointer;font-weight:bold;">–</button>
                <button class="qty-btn" data-index="${index}" data-action="increase"
                  style="width:28px;height:28px;border:none;border-radius:5px;background:#eee;color:#333;cursor:pointer;font-weight:bold;">+</button>
              </div>
            </div>
          </div>
          <button class="remove-btn" data-index="${index}"
            style="color:red;border:none;background:none;cursor:pointer;font-size:18px;">✖</button>
        </div>
      `).join('');
    };

    Swal.fire({
      title: `🛒 Cart (${cart.length} items)`,
      html: `
        <div id="cart-items">${renderCartHtml()}</div>
        <hr/>
        <strong id="grand-total">Grand Total: $${calculateTotal().toFixed(2)}<br/>
        ៛${(calculateTotal() * 4100).toLocaleString()}</strong><br/><br/>
        <button id="checkoutBtn" class="swal2-confirm swal2-styled">Checkout</button>
      `,
      showConfirmButton: false,
      didOpen: () => {
        const bindEvents = () => {
          document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e: any) => {
              const index = parseInt(e.target.getAttribute('data-index'));
              const action = e.target.getAttribute('data-action');

              if (action === 'increase') {
                cart[index].quantity += 1;
              } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
              }

              updateCartInStorage();
              document.getElementById('cart-items')!.innerHTML = renderCartHtml();
              document.getElementById('grand-total')!.innerHTML = `
                Grand Total: $${calculateTotal().toFixed(2)}<br/>
                ៛${(calculateTotal() * 4100).toLocaleString()}
              `;
              bindEvents(); // re-bind
            });
          });

          document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e: any) => {
              const index = parseInt(e.target.getAttribute('data-index'));
              cart.splice(index, 1);
              updateCartInStorage();

              if (cart.length === 0) {
                Swal.close();
                Swal.fire('Cart is empty!');
                return;
              }

              document.getElementById('cart-items')!.innerHTML = renderCartHtml();
              document.getElementById('grand-total')!.innerHTML = `
                Grand Total: $${calculateTotal().toFixed(2)}<br/>
                ៛${(calculateTotal() * 4100).toLocaleString()}
              `;
              bindEvents();
            });
          });

          const checkoutBtn = document.getElementById('checkoutBtn');
          if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkoutPopup(calculateTotal()));
          }
        };

        bindEvents();
      }
    });
  }

  checkoutPopup(totalUSD: number) {
    const exchangeRate = 4100;
    const totalKHR = totalUSD * exchangeRate;

    Swal.fire({
      title: '🧾 Checkout',
      html: `
        <p><strong>Total (USD):</strong> $${totalUSD.toFixed(2)}</p>
        <p><strong>Total (KHR):</strong> ៛${totalKHR.toLocaleString()}</p>
        <input id="name" class="swal2-input" placeholder="Full Name" />
        <input id="address" class="swal2-input" placeholder="Address" />
        <input id="phone" class="swal2-input" placeholder="Phone Number" />
        <select id="payment" class="swal2-select">
          <option value="cash">Pay by Cash</option>
          <option value="transfer">Bank Transfer</option>
        </select>
      `,
      confirmButtonText: 'Confirm Order',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const address = (document.getElementById('address') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const payment = (document.getElementById('payment') as HTMLSelectElement).value;

        if (!name || !address || !phone) {
          Swal.showValidationMessage('Please fill out all fields');
          return false;
        }

        return { name, address, phone, payment };
      }
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Order Info:', result.value);

        localStorage.removeItem('cart');
        this.cartCount = 0;
        window.dispatchEvent(new Event('storage'));

        Swal.fire({
          title: '🎉 Order Completed!',
          text: 'Thank you for your purchase!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}
