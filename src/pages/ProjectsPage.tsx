import { useNavigate } from "react-router-dom";
import "./ProjectsPage.css";

const PROFILE = {
  name: "Adish Jain",
  tagline: "Software Engineer | ML/AI + Full-Stack",
  photoUrl: "https://github.com/adishjain97230.png",
};

const PROJECTS = [
  {
    title: "Loan Approval Chatbot",
    description:
      "A modern chatbot experience for loan eligibility guidance and Q&A, with dark/light themes and curated prompts.",
    stack: ["React", "TypeScript", "Python", "Django"],
    websiteUrl: "/ml-chatbot",
    repoLinks: [
      {
        label: "GitHub Frontend Repo",
        href: "https://github.com/adishjain97230/frontendach",
      },
      {
        label: "GitHub Backend Repo",
        href: "https://github.com/adishjain97230/Credit_Assessment_Service",
      },
    ],
  },
  {
    title: "Credit Assessment Service",
    description:
      "Backend service for credit-risk workflows, model-backed scoring logic, and API-first integration for frontend clients.",
    stack: ["Django", "Redis", "Nginx", "Docker", "AWS"],
    repoLinks: [
      {
        label: "GitHub Repo",
        href: "https://github.com/adishjain97230/Credit_Assessment_Service",
      },
    ],
  },
  {
    title: "More Projects",
    description:
      "A growing collection of ML + product projects, from model-serving APIs to polished frontend experiences.",
    stack: ["Python", "React", "TypeScript", "Docker"],
    repoLinks: [
      {
        label: "GitHub Repo",
        href: "https://github.com/adishjain97230",
      },
    ],
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
  {
    label: "GitHub",
    value: "adishjain97230",
    href: "https://github.com/adishjain97230",
  },
  {
    label: "LinkedIn",
    value: "adish-jain-7373b3229",
    href: "https://www.linkedin.com/in/adish-jain-7373b3229/",
  },
  {
    label: "Email",
    value: "adishjain9723@gmail.com",
    href: "mailto:adishjain9723@gmail.com",
  },
  { label: "Phone", value: "+91 84275 18614", href: "tel:+918427518614" },
  {
    label: "Resume",
    value: "View Resume",
    href: "https://drive.google.com/file/d/your-resume-id/view",
  },
];

export default function ProjectsPage() {
  const navigate = useNavigate();

  const openProject = (project: (typeof PROJECTS)[number]) => {
    const target = project.websiteUrl ?? project.repoLinks[0]?.href;

    if (target.startsWith("/")) {
      navigate(target);
      return;
    }

    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="projects-root">
      <main className="projects-shell">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="hero-kicker">Portfolio</p>
            <h1>{PROFILE.name}</h1>
            <p>{PROFILE.tagline}</p>
          </div>
          <img
            className="hero-photo"
            src={PROFILE.photoUrl}
            alt={`${PROFILE.name} profile`}
          />
        </section>

        <section className="section-block">
          <h2>Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((project) => (
              <article
                key={project.title}
                className="project-card project-card-clickable"
                role="button"
                tabIndex={0}
                onClick={() => openProject(project)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProject(project);
                  }
                }}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.stack.map((item) => (
                    <span key={`${project.title}-${item}`} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="project-buttons">
                  {project.repoLinks.map((repoLink) => (
                    <a
                      key={`${project.title}-${repoLink.label}`}
                      href={repoLink.href}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      {repoLink.label}
                    </a>
                  ))}
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
