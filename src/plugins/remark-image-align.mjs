export function remarkImageAlign() {
  return function transformer(tree) {
    function visit(node) {
      if (!node || typeof node !== 'object') return;

      if (node.type === 'image' && typeof node.url === 'string') {
        const urlStr = node.url;
        let align = null;
        let cleanUrl = urlStr;

        // Check query parameters (e.g. ?align=left, ?left)
        const alignMatch = urlStr.match(/[?&]align=(left|right|full)/i);
        const shorthandQueryMatch = urlStr.match(/[?&](left|right|full)(?:[&#]|$)/i);
        const hashMatch = urlStr.match(/#(left|right|full)$/i);

        if (alignMatch) {
          align = alignMatch[1].toLowerCase();
          cleanUrl = urlStr.replace(/[?&]align=(left|right|full)/i, '');
        } else if (shorthandQueryMatch) {
          align = shorthandQueryMatch[1].toLowerCase();
          cleanUrl = urlStr.replace(/[?&](left|right|full)(?:[&#]|$)/i, '');
        } else if (hashMatch) {
          align = hashMatch[1].toLowerCase();
          cleanUrl = urlStr.replace(/#(left|right|full)$/i, '');
        }

        // Clean trailing ? or & if any
        cleanUrl = cleanUrl.replace(/[?&]$/, '');

        // Fallback for legacy filenames ending with LEFT/RIGHT/FULL
        if (!align) {
          const baseName = urlStr.split('?')[0].split('#')[0];
          const withoutExt = baseName.replace(/\.[^/.]+$/, '');
          const legacyMatch = withoutExt.match(/(?:_|-)?(LEFT|RIGHT|FULL)$/i);
          if (legacyMatch) {
            align = legacyMatch[1].toLowerCase();
          }
        }

        if (align) {
          node.url = cleanUrl;
          node.data = node.data || {};
          node.data.hProperties = node.data.hProperties || {};

          const className = `align-${align}`;
          const currentClass =
            node.data.hProperties.className || node.data.hProperties.class || [];

          if (Array.isArray(currentClass)) {
            if (!currentClass.includes(className)) {
              node.data.hProperties.className = [...currentClass, className];
            }
          } else if (typeof currentClass === 'string') {
            const classes = currentClass.split(/\s+/).filter(Boolean);
            if (!classes.includes(className)) {
              classes.push(className);
              node.data.hProperties.className = classes.join(' ');
            }
          } else {
            node.data.hProperties.className = [className];
          }

          node.data.hProperties['data-align'] = align;
        }
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };
}
