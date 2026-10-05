"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { portfolio } from "@/src/data/portfolio";
import { CircularGallery } from "./react-bits/CircularGallery";
import { Reveal } from "./Reveal";

export function ProjectGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryItems = useMemo(
    () =>
      portfolio.projects.map((project) => ({
        image: project.image,
        text: project.title,
      })),
    [],
  );
  const activeProject = portfolio.projects[activeIndex] ?? portfolio.projects[0];

  const openProject = (index: number) => {
    const project = portfolio.projects[index];
    if (project) window.location.assign(`/work#${project.slug}`);
  };

  return (
    <>
      <div className="project-gallery-experience">
        <Reveal>
          <div className="project-gallery-canvas">
            <CircularGallery
              items={galleryItems}
              bend={6}
              textColor="#ffffff"
              borderRadius={0.1}
              scrollEase={0.08}
              scrollSpeed={1.6}
              font={'600 28px "Roboto Mono"'}
              fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500;600&display=swap"
              onIndexChange={setActiveIndex}
              onActivate={openProject}
            />
          </div>
        </Reveal>
        <Reveal delay={60}>
          <p className="project-gallery-instructions">
            Drag or scroll to explore
            <span>Arrow keys supported</span>
          </p>
        </Reveal>
        <Reveal delay={90}>
          <div className="project-gallery-info" aria-live="polite">
            <div>
              <p>
                <span>{activeProject.number} / 03</span>
                <span>{activeProject.category}</span>
              </p>
              <h3>{activeProject.title}</h3>
            </div>
            <div>
              <p>{activeProject.summary}</p>
              <Link href={`/work#${activeProject.slug}`}>
                View case study <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="project-gallery-fallback">
        {portfolio.projects.map((project, index) => (
          <Reveal key={project.slug} staggerIndex={index} stagger={55}>
            <article className="project-fallback-card">
              <Link href={`/work#${project.slug}`}>
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  width={1200}
                  height={820}
                  sizes="(max-width: 760px) 100vw, 33vw"
                  unoptimized
                />
                <span>{project.number}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <strong>View case study ↗</strong>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
