import useHeaderHeight from '@/hooks/useHeaderHeight';

/** Keeps --site-header-offset in sync for fixed-header page padding */
const HeaderHeightSync = ({ headerRef }) => {
  useHeaderHeight(headerRef);
  return null;
};

export default HeaderHeightSync;
