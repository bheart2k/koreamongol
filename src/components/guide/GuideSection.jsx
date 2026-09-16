'use client';

import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import styles from './GuideSection.module.css';

// Keep the section and its heading intact for existing styles, TOCs and links.
export function GuideSection({ children, id, className, alwaysOpen = false }) {
  const [mobile, setMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const nodes = Children.toArray(children);
  const heading = nodes.find((node) => node.type === 'h2');
  const collapsed = mobile && !expanded && !alwaysOpen;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const resize = () => setMobile(media.matches);
    resize();
    media.addEventListener('change', resize);

    const reveal = (targetId, scroll = true) => {
      const target = document.getElementById(targetId);
      if (!target || !ref.current?.contains(target)) return;
      flushSync(() => setExpanded(true));
      if (scroll) target.scrollIntoView({ block: 'start' });
    };
    const fromHash = () => {
      try { reveal(decodeURIComponent(window.location.hash.slice(1))); } catch { /* Invalid URL fragment. */ }
    };
    const click = (event) => {
      const link = event.target.closest('a[href]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
        try { reveal(decodeURIComponent(url.hash.slice(1)), false); } catch { /* Invalid URL fragment. */ }
      }
    };
    const fromTOC = (event) => reveal(event.detail, false);
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener('hashchange', fromHash);
    document.addEventListener('click', click, true);
    document.addEventListener('guide:reveal', fromTOC);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener('change', resize);
      window.removeEventListener('hashchange', fromHash);
      document.removeEventListener('click', click, true);
      document.removeEventListener('guide:reveal', fromTOC);
    };
  }, []);

  if (!heading) return <section id={id} className={className}>{children}</section>;
  return (
    <section ref={ref} id={id} className={className} data-collapsed={collapsed || undefined}>
      {cloneElement(heading, {}, mobile && !alwaysOpen ? (
        <button type="button" className={styles.toggle} aria-expanded={!collapsed}
          aria-controls={`${id}-content`} onClick={() => setExpanded(!expanded)}>
          <span>{heading.props.children}</span>
          <ChevronDown aria-hidden="true" className={!collapsed ? styles.rotated : undefined} />
        </button>
      ) : heading.props.children)}
      <div id={`${id}-content`} className={styles.body} data-closed={collapsed || undefined}
        inert={collapsed ? true : undefined} aria-hidden={collapsed || undefined}>
        <div className={styles.bodyInner}>
          {nodes.filter((node) => node !== heading)}
        </div>
      </div>
    </section>
  );
}
