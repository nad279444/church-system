import App from '@/core/App.js';
import store from '@/core/store.js';
import '@/components/ui/Link.js';
import '@/components/ui/Button.js';
import '@/components/common/Indicator.js';

class Header extends App {
  unsubscribe = null;

  constructor() {
    super();
    this.updateIndicator = this.updateIndicator.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribe = store.subscribe((newState) => {
      this.set('isAuthenticated', newState.isAuthenticated);
    });

    setTimeout(() => {
      const navItems = this.querySelectorAll('.nav-item');
      const mobileMenu = this.querySelector('#mobile-menu');
      const hamburgerBtn = this.querySelector('#hamburger-btn');
      const currentPath = window.location.pathname;

      const activate = (el) => {
        if (!el) return;
        // First, deactivate all other items
        navItems.forEach((item) => {
          item.classList.remove('text-yellow-400');
          const indicator = item.querySelector('app-indicator');
          if (indicator) {
            indicator.classList.add('hidden');
          }
        });

        // Then, activate the correct one
        el.classList.add('text-yellow-400');
        const textElement = el.querySelector('span');
        const indicator = el.querySelector('app-indicator');

        if (textElement && indicator) {
          const textWidth = textElement.offsetWidth;
          indicator.style.width = `${textWidth}px`;
          indicator.classList.remove('hidden');
        }
      };

      // On initial load, find the active item from the URL
      const activeItem = Array.from(navItems).find((item) => {
        const link = item.querySelector('a');
        return link && link.getAttribute('href') === currentPath;
      });

      if (activeItem) {
        activate(activeItem);
      } else {
        // If no path matches, default to activating the first item (Home)
        if (currentPath === '/' && navItems.length > 0) activate(navItems[0]);
      }

      // Add smart click listeners
      navItems.forEach((item) => {
        item.addEventListener('click', () => {
          const link = item.querySelector('a');
          // If it's not a real link, activate it immediately.
          // If it IS a real link, do nothing and let the router handle it.
          // The activate() call on page load will handle the indicator.
          if (!link) {
            activate(item);
          }
        });
      });

      // Mobile menu toggle
      if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
        });
      }
    }, 0);
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    // Clean up the event listener
    window.removeEventListener('route-changed', this.updateIndicator);
  }

  updateIndicator() {
    const navItems = this.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;

    // Deactivate all indicators first
    navItems.forEach((item) => {
      item.classList.remove('text-yellow-400');
      const indicator = item.querySelector('app-indicator');
      if (indicator) {
        indicator.classList.add('hidden');
      }
    });

    // Find the active item based on the current URL
    let activeItem = null;
    navItems.forEach((item) => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === currentPath) {
        activeItem = item;
      }
    });

    // Activate the found item
    if (activeItem) {
      activeItem.classList.add('text-yellow-400');
      const textElement = activeItem.querySelector('span');
      const indicator = activeItem.querySelector('app-indicator');

      if (textElement && indicator) {
        const textWidth = textElement.offsetWidth;
        indicator.style.width = `${textWidth}px`;
        indicator.classList.remove('hidden');
      }
    }
  }

  render() {
    return `
      <header class="fixed top-0 left-0 right-0 z-50 px-[10ch] py-10 backdrop-blur bg-transparent">
        <nav class="flex items-center justify-between">
          <!-- Logo + Nav -->
          <div class="flex items-center space-x-4">
            <!-- Hamburger button (mobile only) -->
            <button id="hamburger-btn" class="md:hidden text-white focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <!-- Desktop Nav -->
            <ul class="hidden md:flex space-x-[10ch] text-lg font-medium text-white" id="nav-list">
              ${this.getNavItems()}
            </ul>
          </div>

          <!-- Contact Button -->
          <a href="/contact" >
            <button class="flex gap-2 rounded-full border border-white px-4 py-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="size-5 self-center">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.75 3.75 18 6m0 0 2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25
                      m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0
                      .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062
                      1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004
                      1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423
                      1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"/>
              </svg>
              <span class="text-lg">Contact Us</span>
            </button>
          </a>
        </nav>

        <!-- Mobile Menu -->
        <ul id="mobile-menu" class="md:hidden mt-4 flex flex-col gap-4 text-white text-lg font-medium hidden">
          ${this.getNavItems()}
        </ul>
      </header>
    `;
  }

  getNavItems() {
    return `
      <li class="nav-item relative flex flex-col items-center cursor-pointer">
        <span><a href='/'>Home</a></span>
        <app-indicator class="hidden"></app-indicator>
      </li>
      <li class="nav-item relative flex flex-col items-center cursor-pointer">
        <span><a href='/events'>Services & Events</a></span>
        <app-indicator class="hidden"></app-indicator>
      </li>
      <li class="nav-item relative flex flex-col items-center cursor-pointer">
        <span><a href='/ministry'>Ministries</a></span>
        <app-indicator class="hidden"></app-indicator>
      </li>
      <li class="nav-item relative flex flex-col items-center cursor-pointer">
        <span><a href='/lifegroups'>Life Groups</a></span>
        <app-indicator class="hidden"></app-indicator>
      </li>
      <li class="nav-item relative flex flex-col items-center cursor-pointer">
        <span>Give</span>
        <app-indicator class="hidden"></app-indicator>
      </li>
    `;
  }
}

customElements.define('app-header', Header);
export default Header;
