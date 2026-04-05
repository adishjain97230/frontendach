import { useEffect, useState } from "react";
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
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Django", icon: "https://cdn.simpleicons.org/django/092E20" },
  { name: "Redis", icon: "https://cdn.simpleicons.org/redis/DC382D" },
  { name: "Nginx", icon: "https://cdn.simpleicons.org/nginx/009639" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Golang", icon: "https://cdn.simpleicons.org/go/00ADD8" },
  { name: "Java", icon: "https://cdn.simpleicons.org/openjdk/ED8B00" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/6E7681" },
  { name: "LangChain", icon: "https://cdn.simpleicons.org/langchain/1C3C3C" },
  { name: "LangGraph", short: "LG" },
  { name: "scikit-learn", icon: "https://cdn.simpleicons.org/scikitlearn/F7931E" },
  { name: "NumPy", icon: "https://cdn.simpleicons.org/numpy/013243" },
  { name: "Pandas", icon: "https://cdn.simpleicons.org/pandas/150458" },
  {
    name: "AWS",
    icon: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg",
  },
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
  { name: "ASGI", icon: "https://cdn.simpleicons.org/fastapi/009688" },
];

const CONTACTS = [
  {
    label: "GitHub",
    value: "adishjain97230",
    href: "https://github.com/adishjain97230",
    icon: "https://cdn.simpleicons.org/github/6E7681",
  },
  {
    label: "LinkedIn",
    value: "adish-jain-7373b3229",
    href: "https://www.linkedin.com/in/adish-jain-7373b3229/",
    icon: "https://cdn.simpleicons.org/linkedin/0A66C2",
  },
  {
    label: "Email",
    value: "adishjain9723@gmail.com",
    href: "mailto:adishjain9723@gmail.com",
    icon: "https://cdn.simpleicons.org/gmail/EA4335",
  },
  {
    label: "WhatsApp",
    value: "+91 84275 18614",
    href: "https://wa.me/918427518614",
    icon: "https://cdn.simpleicons.org/whatsapp/25D366",
  },
  {
    label: "Resume",
    value: "View Resume",
    href: "https://drive.google.com/file/d/your-resume-id/view",
    icon: "https://cdn.simpleicons.org/readthedocs/8CA1AF",
  },
];

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const openProject = (project: (typeof PROJECTS)[number]) => {
    const target = project.websiteUrl ?? project.repoLinks[0]?.href;

    if (target.startsWith("/")) {
      navigate(target);
      return;
    }

    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="projects-root" data-theme={isDark ? "dark" : "light"}>
      <main className="projects-shell">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="hero-kicker">Portfolio</p>
            <h1>{PROFILE.name}</h1>
            <p>{PROFILE.tagline}</p>
          </div>
          <div className="hero-side">
            <div className="project-theme-toggle" role="group" aria-label="Theme toggle">
              <button
                type="button"
                className={`project-theme-btn ${!isDark ? "active" : ""}`}
                onClick={() => setIsDark(false)}
                aria-label="Use light mode"
              >
                <SunIcon />
              </button>
              <button
                type="button"
                className={`project-theme-btn ${isDark ? "active" : ""}`}
                onClick={() => setIsDark(true)}
                aria-label="Use dark mode"
              >
                <MoonIcon />
              </button>
            </div>
            <img
              className="hero-photo"
              src={PROFILE.photoUrl}
              alt={`${PROFILE.name} profile`}
            />
          </div>
        </section>

        <section className="section-block">
          <h2>Projects</h2>
          <div className="projects-scroll">
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
          </div>
        </section>

        <section className="section-block">
          <h2>Technologies I Work With</h2>
          <div className="tech-scroll">
            <div className="tech-name-grid">
              {TECHNOLOGIES.map((tech) => (
                <span key={tech.name} className="tech-name-pill">
                  {tech.icon ? (
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="tech-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="tech-logo-fallback">{tech.short ?? "T"}</span>
                  )}
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
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
                <span className="contact-label-row">
                  <img
                    src={contact.icon}
                    alt=""
                    className="contact-logo"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  <span>{contact.label}</span>
                </span>
                <strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
