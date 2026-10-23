import useSiteScroll from '../hooks/useSiteScroll.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// Navbar + page content + Footer shared by both pages.
// `main` wraps the content in <main class="awards-page-main"> like awards.html.
export default function SiteLayout({ variant, main = false, mainClass, mainClassName, children }) {
  const scrolled = useSiteScroll();
  const cls = mainClass || mainClassName || (
<<<<<<< HEAD
    variant === 'team' ? 'awards-page-main' : 
=======
    variant === 'team' ? 'team-page-main' : 
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
    (variant === 'collector' ? 'collector-page-main' : 
    (variant === 'blog' ? 'blog-page-main' : 
    (variant === 'contact' ? 'contact-page-main' : 'awards-page-main')))
  );
  return (
    <>
      <Navbar variant={variant} scrolled={scrolled} />
      {main ? <main className={cls}>{children}</main> : children}
      <Footer variant={variant} />
    </>
  );
}
