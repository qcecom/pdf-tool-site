import { Link } from "./Link";
import Logo from "./Logo";

export default function Header(){
  return(
    <header className="header container" role="banner">
      <Link href="/" className="brand" ariaLabel="Home">
        <Logo/><strong>nouploadpdf.com</strong>
      </Link>
      <nav className="nav" aria-label="Primary">
        <Link href="/#tools">Tools</Link>
        <Link href="/why-ats">Why ATS</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/security">Security</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/changelog">Changelog</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
