export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <p className="footer-copy">&copy; {new Date().getFullYear()} Thornwood Ledger. All rights reserved.</p>
        <ul className="footer-links" role="list">
          <li>
            <a href="#capabilities" className="footer-link">Capabilities</a>
          </li>
          <li>
            <a href="#walkthrough" className="footer-link">Book a Walkthrough</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
