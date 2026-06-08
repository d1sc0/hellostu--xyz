document.addEventListener('DOMContentLoaded', () => {
  const widgets = document.querySelectorAll('.playlist-widget');

  widgets.forEach(widget => {
    const tabs = widget.querySelectorAll('.playlist-widget__tab');
    const panels = widget.querySelectorAll('.playlist-widget__panel');
    const height = widget.getAttribute('data-height') || '380';

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const platform = tab.getAttribute('data-platform');
        const id = tab.getAttribute('data-id');
        if (!platform || !id) return;

        // 1. Update active tab classes
        tabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        // 2. Hide all panels
        panels.forEach(p => {
          p.classList.remove('is-active');
        });

        // 3. Show active panel & inject iframe if not already loaded
        const targetPanel = widget.querySelector(`#panel-${platform}`);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
          
          const hasIframe = targetPanel.querySelector('iframe');
          if (!hasIframe) {
            const iframe = document.createElement('iframe');
            if (platform === 'spotify') {
              iframe.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;
              iframe.style.borderRadius = '12px';
              iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
            } else if (platform === 'apple') {
              iframe.src = `https://embed.music.apple.com/gb/playlist/${id}`;
              iframe.style.borderRadius = '10px';
              iframe.style.background = 'transparent';
              iframe.setAttribute('allow', 'autoplay *; encrypted-media *; fullscreen *; clipboard-write *');
            }
            
            iframe.width = '100%';
            iframe.height = `${height}px`;
            iframe.style.border = '0';
            iframe.setAttribute('loading', 'lazy');
            
            targetPanel.appendChild(iframe);
          }
        }
      });
    });
  });
});
