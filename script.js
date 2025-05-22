document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const swatches = document.querySelectorAll('.swatch');
  const sizeSelect = document.getElementById('size-select');
  const sizeChartBtn = document.getElementById('size-chart-btn');
  const sizeChartModal = document.getElementById('size-chart-modal');
  const sizeChartClose = sizeChartModal.querySelector('.modal-close');
  const compareColorsBtn = document.getElementById('compare-colors-btn');
  const compareColorsModal = document.getElementById('compare-colors-modal');
  const compareColorsClose = compareColorsModal.querySelector('.modal-close');
  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Data for prices by color (example)
  const colorPrices = {
    red: 99.99,
    blue: 104.99,
    green: 97.99,
    yellow: 102.99,
    black: 99.99
  };

  // Update main image and price when a thumbnail or swatch is clicked
  function setActiveColor(color) {
    // Update main image src
    mainImage.src = `assets/product1-${color}.jpg`;
    mainImage.alt = `Product - ${color.charAt(0).toUpperCase() + color.slice(1)}`;

    // Update price
    document.getElementById('price').textContent = `$${colorPrices[color].toFixed(2)}`;

    // Update active thumbnail
    thumbnails.forEach(t => {
      if (t.dataset.color === color) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Update active swatch and aria attributes
    swatches.forEach(s => {
      if (s.dataset.color === color) {
        s.classList.add('active');
        s.setAttribute('aria-checked', 'true');
        s.tabIndex = 0;
        s.focus();
      } else {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
        s.tabIndex = -1;
      }
    });

    // Save selected color in localStorage
    localStorage.setItem('selectedColor', color);
  }

  // Click thumbnails
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      setActiveColor(thumb.dataset.color);
    });
  });

  // Click swatches (with keyboard support)
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      setActiveColor(swatch.dataset.color);
    });
    swatch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveColor(swatch.dataset.color);
      }
      // Arrow key navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = swatch.nextElementSibling || swatches[0];
        next.focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = swatch.previousElementSibling || swatches[swatches.length -1];
        prev.focus();
      }
    });
  });

  // Load saved selected color
  const savedColor = localStorage.getItem('selectedColor');
  if (savedColor && colorPrices[savedColor]) {
    setActiveColor(savedColor);
  }

  // Size select save/load from localStorage
  sizeSelect.addEventListener('change', () => {
    localStorage.setItem('selectedSize', sizeSelect.value);
  });
  const savedSize = localStorage.getItem('selectedSize');
  if (savedSize) {
    sizeSelect.value = savedSize;
  }

  // Size chart modal open/close
  sizeChartBtn.addEventListener('click', () => {
    sizeChartModal.hidden = false;
    sizeChartModal.querySelector('.modal-content').focus();
  });
  sizeChartClose.addEventListener('click', () => {
    sizeChartModal.hidden = true;
    sizeChartBtn.focus();
  });
  sizeChartModal.querySelector('.modal-overlay').addEventListener('click', () => {
    sizeChartModal.hidden = true;
    sizeChartBtn.focus();
  });

  // Compare colors modal open/close
  compareColorsBtn.addEventListener('click', () => {
    compareColorsModal.hidden = false;
    compareColorsModal.querySelector('.modal-content').focus();
  });
  compareColorsClose.addEventListener('click', () => {
    compareColorsModal.hidden = true;
    compareColorsBtn.focus();
  });
  compareColorsModal.querySelector('.modal-overlay').addEventListener('click', () => {
    compareColorsModal.hidden = true;
    compareColorsBtn.focus();
  });

  // Tabs functionality
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and hide panels
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      tabPanels.forEach(panel => {
        panel.hidden = true;
        panel.classList.remove('active');
      });

      // Activate clicked tab & panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;
      const tabId = tab.dataset.tab;
      const panel = document.getElementById(tabId);
      if (panel) {
        panel.hidden = false;
        panel.classList.add('active');
      }
      tab.focus();
    });

    tab.addEventListener('keydown', (e) => {
      let index = Array.from(tabs).indexOf(tab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % tabs.length;
        tabs[nextIndex].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index -1 + tabs.length) % tabs.length;
        tabs[prevIndex].focus();
      }
    });
  });

  // Image zoom toggle on main image
  mainImage.addEventListener('click', () => {
    if (mainImage.classList.contains('zoomed')) {
      mainImage.classList.remove('zoomed');
    } else {
      mainImage.classList.add('zoomed');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const allAddToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-bundle-btn, .carousel .btn-secondary, .related-card .btn-ter');

  allAddToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      let productName = 'Product';
      let quantity = 1;

      const parent = button.closest('.cart-controls') || button.parentElement;
      const qtyInput = parent.querySelector('.qty-input');
      if (qtyInput) {
        quantity = parseInt(qtyInput.value) || 1;
      }

      if (button.classList.contains('add-to-cart-btn')) {
        productName = document.querySelector('.product-title')?.textContent?.trim() || 'Product';
      } else if (button.classList.contains('add-bundle-btn')) {
        productName = 'Bundle: Sneakers + Socks + Cleaner';
      } else if (button.closest('.carousel-item')) {
        productName = button.closest('.carousel-item').querySelector('p')?.textContent?.trim() || 'Product';
      } else if (button.closest('.related-card')) {
        const titleElement = button.closest('.related-card').querySelector('p');
        productName = titleElement?.textContent?.trim() || 'Product';
      }

      alert(`🛒 Added "${productName}" (Qty: ${quantity}) to cart`);
    });
  });
});
