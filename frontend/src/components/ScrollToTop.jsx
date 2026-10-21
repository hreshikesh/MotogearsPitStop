import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { trackPageView } from '@/utils/analytics';

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        trackPageView(`${pathname}${search}`, document.title);
    }, [pathname, search]);

    return null;
}

export default ScrollToTop;
