import { ProjectImage } from "@/app/components/ProjectImage";

export default function Nav() {
  return (
    <nav className="nav-root" aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-brand" aria-label="Thornwood Ledger home">
          <ProjectImage id="logo" className="nav-logo" />
        </a>
        <ul className="nav-links" role="list">
          <li><a href="#capabilities" className="nav-link">Capabilities</a></li>
          <li><a href="#walkthrough" className="nav-link">Book a Walkthrough</a></li>
        </ul>
      </div>
    </nav>
  );
}
