"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Project } from "../data/projects";

type SortKey = "featured" | "az" | "za" | "category";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "az", label: "Name: A to Z" },
  { value: "za", label: "Name: Z to A" },
  { value: "category", label: "Category" },
];

function GridCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-line card-shadow hover:border-accent/40 hover:card-shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-44 sm:h-52 overflow-hidden">
        <img
          src={project.image}
          alt={`${project.title} website preview`}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col flex-1 p-6 md:p-7">
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-2">
          {project.category}
        </span>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          {project.title}
        </h3>
        <p className="text-muted leading-relaxed text-sm mb-5 flex-1">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground/70 group-hover:text-accent transition-colors">
            View Project
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-light border border-line flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ProjectsGrid({ items }: { items: Project[] }) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...items];
    switch (sort) {
      case "az":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "category":
        return list.sort(
          (a, b) =>
            a.category.localeCompare(b.category) ||
            a.title.localeCompare(b.title)
        );
      default:
        return list;
    }
  }, [items, sort]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8 md:mb-10">
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-foreground">{sorted.length}</span>{" "}
          projects
        </p>

        <label className="relative inline-flex items-center">
          <span className="sr-only">Sort projects</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none rounded-full bg-white border border-line pl-5 pr-11 py-2.5 text-sm font-semibold text-foreground hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 pointer-events-none text-muted"
          />
        </label>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {sorted.map((project) => (
          <motion.div
            key={project.title}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GridCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
