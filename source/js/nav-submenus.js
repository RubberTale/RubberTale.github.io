/**
 * nav-submenus.js
 * Automatically groups Emperor / Dynasty genealogies under a dedicated secondary sub-menu
 * to keep "探索与更多" clean, elegant, and avoid conflicting with other tools.
 */
(function() {
  function setupNavSubmenus() {
    const containers = [
      document.querySelector('#nav .menus_items'),
      document.querySelector('#sidebar #sidebar-menus')
    ].filter(Boolean);

    containers.forEach(menuContainer => {
      // Find "探索与更多" menu item
      const menuItems = menuContainer.querySelectorAll('.menus_item');
      let targetItem = null;
      menuItems.forEach(item => {
        const text = item.textContent || '';
        if (text.includes('探索与更多')) {
          targetItem = item;
        }
      });
      if (!targetItem) return;

      const childUl = targetItem.querySelector('.menus_item_child');
      if (!childUl || childUl.querySelector('.menus_sub_item')) return;

      const lis = Array.from(childUl.children);
      const genealogyLis = [];

      lis.forEach(li => {
        const a = li.querySelector('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (href.startsWith('/genealogy/') || href.includes('-genealogy')) {
          genealogyLis.push(li);
        }
      });

      if (genealogyLis.length === 0) return;

      const isMobile = menuContainer.closest('#sidebar') !== null;

      // Create the sub-menu container li
      const subItem = document.createElement('li');
      subItem.className = 'menus_sub_item has-sub-menu';

      // Trigger button / link
      const subTrigger = document.createElement('a');
      subTrigger.className = 'site-page child sub-trigger';
      subTrigger.href = '/genealogy/';
      
      const arrowClass = isMobile ? 'fa-chevron-down' : 'fa-chevron-left';
      subTrigger.innerHTML = `
        <span class="sub-title">
          <i class="fas fa-crown fa-fw"></i>
          <span> 历代皇帝谱系</span>
        </span>
        <i class="fas ${arrowClass} sub-arrow"></i>
      `;
      subItem.appendChild(subTrigger);

      // Sub-menu list
      const subUl = document.createElement('ul');
      subUl.className = 'menus_sub_child';

      // Insert subItem right where the first genealogy item was
      const firstGenLi = genealogyLis[0];
      childUl.insertBefore(subItem, firstGenLi);

      // Move all genealogy lis inside subUl
      genealogyLis.forEach(li => subUl.appendChild(li));
      subItem.appendChild(subUl);

      // Mobile accordion interaction
      if (isMobile) {
        subTrigger.addEventListener('click', function(e) {
          if (e.target.closest('.sub-arrow') || !subUl.classList.contains('sub-open')) {
            e.preventDefault();
            subUl.classList.toggle('sub-open');
            const arrow = subTrigger.querySelector('.sub-arrow');
            if (arrow) {
              arrow.classList.toggle('rotate');
            }
          }
        });
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavSubmenus);
  } else {
    setupNavSubmenus();
  }

  // Backup timer in case of delayed DOM rendering
  let attempts = 0;
  const interval = setInterval(function() {
    attempts++;
    setupNavSubmenus();
    if (attempts >= 6 || document.querySelector('.menus_sub_item')) {
      clearInterval(interval);
    }
  }, 250);
})();
