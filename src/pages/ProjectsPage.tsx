import { Link } from "react-router-dom";
import "./ProjectsPage.css";

const PROFILE = {
  name: "Adish Jain",
  tagline: "Software Engineer | ML + Full-Stack",
  photoUrl: "https://github.com/adishjain97230.png",
};

const PROJECTS = [
  {
    title: "Loan Approval Chatbot",
    description:
      "A modern chatbot experience for loan eligibility guidance and Q&A, with dark/light themes and curated prompts.",
    stack: ["React", "TypeScript", "Python", "Django"],
    ctaLabel: "Open Chatbot",
    ctaTo: "/ml-chatbot",
    repoLabel: "Frontend Repo",
    repoUrl: "https://github.com/adishjain97230/frontendach",
  },
  {
    title: "Credit Assessment Service",
    description:
      "Backend service for credit-risk workflows, model-backed scoring logic, and API-first integration for frontend clients.",
    stack: ["Django", "Redis", "Nginx", "Docker", "AWS"],
    ctaLabel: "View Backend Repo",
    ctaTo: "https://github.com/adishjain97230/Credit_Assessment_Service",
    repoLabel: "Backend Repo",
    repoUrl: "https://github.com/adishjain97230/Credit_Assessment_Service",
    external: true,
  },
  {
    title: "More Projects",
    description:
      "A growing collection of ML + product projects, from model-serving APIs to polished frontend experiences.",
    stack: ["Python", "React", "TypeScript", "Docker"],
    ctaLabel: "Explore GitHub",
    ctaTo: "https://github.com/adishjain97230",
    repoLabel: "GitHub Profile",
    repoUrl: "https://github.com/adishjain97230",
    external: true,
  },
];

const TECHNOLOGIES = [
  "Python",
  "Django",
  "Redis",
  "Nginx",
  "React",
  "TypeScript",
  "AWS",
  "Docker",
  "ASGI",
];

const CONTACTS = [
  { label: "GitHub", value: "adishjain97230", href: "https://github.com/adishjain97230" },
  {
    label: "LinkedIn",
    value: "adish-jain-7373b3229",
    href: "https://www.linkedin.com/in/adish-jain-7373b3229/",
  },
  { label: "Email", value: "adishjain9723@gmail.com", href: "mailto:adishjain9723@gmail.com" },
  { label: "Phone", value: "+91 84275 18614", href: "tel:+918427518614" },
  {
    label: "Resume",
    value: "View Resume",
    href: "https://drive.google.com/file/d/your-resume-id/view",
  },
];

export default function ProjectsPage() {
  return (
    <div className="projects-root">
      <main className="projects-shell">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="hero-kicker">Portfolio</p>
            <h1>{PROFILE.name}</h1>
            <p>{PROFILE.tagline}</p>
          </div>
          <img className="hero-photo" src={PROFILE.photoUrl} alt={`${PROFILE.name} profile`} />
        </section>

        <section className="section-block">
          <h2>Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((project) => (
              <article key={project.title} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.stack.map((item) => (
                    <span key={`${project.title}-${item}`} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="card-actions">
                  {project.external ? (
                    <a href={project.ctaTo} target="_blank" rel="noreferrer" className="btn-primary">
                      {project.ctaLabel}
                    </a>
                  ) : (
                    <Link to={project.ctaTo} className="btn-primary">
                      {project.ctaLabel}
                    </Link>
                  )}
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    {project.repoLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block">
          <h2>Technologies I Work With</h2>
          <div className="tech-name-grid">
            {TECHNOLOGIES.map((tech) => (
              <span key={tech} className="tech-name-pill">
                {tech}
              </span>
            ))}
          </div>
        </section>

        <footer className="section-block contact-block">
          <h2>Contact</h2>
          <div className="contact-grid">
            {CONTACTS.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="contact-item"
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <span>{contact.label}</span>
                <strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
