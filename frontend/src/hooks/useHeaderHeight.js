import { useState, useEffect } from 'react';

const useHeaderHeight = (headerRef) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      let totalHeight = 0;

      // Access announcement and navbar refs from Header component
      if (headerRef?.current) {
        const announcementRef = headerRef.current.announcementRef;
        const navbarRef = headerRef.current.navbarRef;

        // Measure announcement bar height if it exists
        if (announcementRef?.current) {
          totalHeight += announcementRef.current.offsetHeight;
        }

        // Measure navbar height if it exists
        if (navbarRef?.current) {
          totalHeight += navbarRef.current.offsetHeight;
        }
      }

      const pageOffset = totalHeight > 0 ? totalHeight + 12 : 120;
      document.documentElement.style.setProperty('--site-header-offset', `${pageOffset}px`);
      setHeaderHeight(totalHeight);
    };

    // Calculate initial height after a short delay to ensure DOM is rendered
    const initialTimeout = setTimeout(calculateHeaderHeight, 100);
    
    // Calculate again after component mount
    calculateHeaderHeight();

    // Recalculate on window resize (also fired when desktop nav collapses)
    window.addEventListener('resize', calculateHeaderHeight);

    let resizeObserver;
    const attachResizeObserver = () => {
      const navbarEl = headerRef?.current?.navbarRef?.current;
      if (!navbarEl || resizeObserver) return;
      resizeObserver = new ResizeObserver(calculateHeaderHeight);
      resizeObserver.observe(navbarEl);
    };
    attachResizeObserver();
    const observerRetry = setInterval(() => {
      attachResizeObserver();
      if (resizeObserver) clearInterval(observerRetry);
    }, 100);
    setTimeout(() => clearInterval(observerRetry), 2000);

    // Recalculate periodically for the first second (handles dynamic content loading)
    const intervals = [200, 400, 600, 800, 1000].map(delay =>
      setTimeout(calculateHeaderHeight, delay)
    );

    // Cleanup
    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
      clearInterval(observerRetry);
      resizeObserver?.disconnect();
      clearTimeout(initialTimeout);
      intervals.forEach(clearTimeout);
    };
  }, [headerRef]);

  return headerHeight;
};

export default useHeaderHeight;