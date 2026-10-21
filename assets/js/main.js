/* Progressive enhancements only: navigation, details, and links work without JS. */
(() => {
  'use strict';

  const descriptions = {
    interface: 'React interfaces that make complex observability data understandable and useful.',
    services: 'Java services for telemetry ingestion, infrastructure graphs, and querying at scale.',
    infrastructure: 'Investigating reliability across Kubernetes, Kafka, Elasticsearch, and Cassandra.'
  };
  const figure = document.querySelector('.system-figure');
  const selector = document.querySelector('.layer-selector');
  const description = document.querySelector('#layer-description');
  if (figure && selector && description) {
    selector.hidden = false;
    figure.dataset.layer = 'interface';
    description.textContent = descriptions.interface;
    selector.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-layer]');
      if (!button || !Object.hasOwn(descriptions, button.dataset.layer)) return;
      selector.querySelectorAll('button').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      figure.dataset.layer = button.dataset.layer;
      description.textContent = descriptions[button.dataset.layer];
    });
  }

  const navLinks = [...document.querySelectorAll('[data-nav]')];
  // Highlight the section intersecting the visitor's reading area.
  if ('IntersectionObserver' in window) {
    const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
    const visibleSections = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      const active = sections.find((section) => visibleSections.has(section));
      navLinks.forEach((link) => {
        if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
