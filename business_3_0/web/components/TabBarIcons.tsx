/** 与概念版 `pages.json` tabBar 语义一致（矢量近似，非逐像素 PNG）。 */

export function IconHome({ active }: { active: boolean }) {
  const c = active ? "var(--xlink-primary)" : "var(--xlink-tab-inactive)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "rgba(20,120,255,0.12)" : "none"}
      />
    </svg>
  );
}

export function IconTasks({ active }: { active: boolean }) {
  const c = active ? "var(--xlink-primary)" : "var(--xlink-tab-inactive)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconProjects({ active }: { active: boolean }) {
  const c = active ? "var(--xlink-primary)" : "var(--xlink-tab-inactive)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.7 6.3a4 4 0 010 5.6l-2.1 2.1a4 4 0 01-5.6 0L6 12l4-4 1.6 1.6a2 2 0 002.8-2.8L13 6l1.7-1.7zM3 21l6-6"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconAccount({ active }: { active: boolean }) {
  const c = active ? "var(--xlink-primary)" : "var(--xlink-tab-inactive)";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.5" stroke={c} strokeWidth="1.8" />
      <path
        d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
