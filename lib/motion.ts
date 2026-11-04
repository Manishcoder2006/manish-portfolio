// Scroll motion for the page: Lenis smooth scroll, the reveal effects and one scene per section.
// Ported from the template's inline scripts. Scenes find their elements by the class names and
// ids in app/page.tsx (keep those); with reduced motion none of this runs and the page reads as is.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const NO_PREFERENCE = "(prefers-reduced-motion: no-preference)";

type Task = { id: string; first?: boolean; setup: () => void | (() => void) };

// ---------------------------------------------------------------- helpers

let lenis: Lenis | null = null;
/** The running smooth-scroll instance (null with reduced motion); the phone menu pauses it. */
export const getLenis = () => lenis;

function must<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`motion: ${selector} not found`);
  return element;
}
const all = <T extends Element = HTMLElement>(root: ParentNode, selector: string) => [...root.querySelectorAll<T>(selector)];
const byId = (id: string) => must(document, `#${id}`);

function layoutBox(element: HTMLElement) {
  let x = 0, y = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) { x += node.offsetLeft; y += node.offsetTop; }
  return { x, y, w: element.offsetWidth, h: element.offsetHeight, cx: x + element.offsetWidth / 2, cy: y + element.offsetHeight / 2 };
}

/** Wraps every word in a span for the "ink" reveal and returns the function that restores the text. */
function splitWords(element: HTMLElement) {
  const original = element.innerHTML;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes: Node[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    (node.textContent ?? "").split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { fragment.append(part); return; }
      const word = document.createElement("span");
      word.className = "ink__word";
      word.textContent = part;
      fragment.append(word);
    });
    (node as ChildNode).replaceWith(fragment);
  });
  return () => { element.innerHTML = original; };
}

/** True when section `b` directly follows section `a`: the hero → statement and work → again handoffs need that. */
function adjacent(a: string, b: string) {
  const order = all(document, "[data-8b-section]").filter(section => section.getAttribute("data-8b-section") !== "navigation").map(section => section.id);
  return order.indexOf(a) >= 0 && order[order.indexOf(a) + 1] === b;
}

// ---------------------------------------------------------------- reveal effects (data-8b-motion)

const effects = {
  rise(element: HTMLElement, vars: gsap.TimelineVars = {}) {
    const dot = element.querySelector(".m-dot");
    const timeline = gsap.timeline(vars);
    timeline.fromTo(element, { yPercent: 38, clipPath: "inset(0% -6% 100% -6%)" }, { yPercent: 0, clipPath: "inset(-30% -6% -30% -6%)", duration: 0.95, ease: "expo.out", clearProps: "clipPath,transform" }, 0);
    if (dot) timeline.fromTo(dot, { scale: 0, yPercent: -260 }, { scale: 1, yPercent: 0, duration: 0.75, ease: "back.out(2.2)", clearProps: "transform" }, 0.42);
    return timeline;
  },
  ink(element: HTMLElement, vars: gsap.TimelineVars = {}) {
    return gsap.timeline(vars).fromTo(element.querySelectorAll(".ink__word"), { opacity: 0.16 }, { opacity: 1, duration: 0.3, stagger: 0.06, ease: "none" });
  },
  iris(element: HTMLElement, vars: gsap.TimelineVars = {}) {
    const image = element.querySelector("img");
    const timeline = gsap.timeline(vars);
    timeline.fromTo(element, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.15, ease: "expo.inOut", clearProps: "clipPath" }, 0);
    if (image) timeline.fromTo(image, { scale: 1.2 }, { scale: 1, duration: 1.5, ease: "expo.out", clearProps: "transform" }, 0.15);
    return timeline;
  },
};

function effectTasks(): Task[] {
  const tasks: Task[] = [];
  all(document, "[data-8b-section]").forEach(section => {
    const bound = (name: string) => all(section, `[data-8b-motion~="${name}"]`);
    const rise = bound("rise"), ink = bound("ink"), iris = bound("iris");
    const first = section.getBoundingClientRect().top < innerHeight;
    if (rise.length) tasks.push({
      id: `effect:rise:${section.id}`, first, setup: () => {
        rise.forEach((element, index) => ScrollTrigger.create({ id: `effect:rise:${section.id}:${index}`, trigger: element, start: "top 88%", once: true, animation: effects.rise(element, { paused: true }) }));
      }
    });
    if (ink.length) tasks.push({
      id: `effect:ink:${section.id}`, first, setup: () => {
        const reverts = ink.map(splitWords);
        ink.forEach((element, index) => ScrollTrigger.create({ id: `effect:ink:${section.id}:${index}`, trigger: element, start: "top 88%", end: "bottom 68%", scrub: 0.4, animation: effects.ink(element) }));
        return () => reverts.forEach(revert => revert());
      }
    });
    if (iris.length) tasks.push({
      id: `effect:iris:${section.id}`, first, setup: () => {
        iris.forEach((element, index) => ScrollTrigger.create({ id: `effect:iris:${section.id}:${index}`, trigger: element, start: "top 86%", once: true, animation: effects.iris(element, { paused: true }) }));
      }
    });
  });
  return tasks;
}

// ---------------------------------------------------------------- scenes (one per section)

const heroScene: Task = {
  id: "scene:hero", first: true, setup() {
    if (!adjacent("hero", "statement")) return;
    const hero = byId("hero");
    const target = must(byId("statement"), ".statement__dot");
    const aperture = must(hero, ".hero__aperture");
    const geometry = () => {
      const from = layoutBox(aperture), to = layoutBox(target);
      return { x: to.cx - from.cx, y: to.cy - from.cy, scale: to.w / from.w };
    };
    gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "hero:exit", trigger: hero, start: "bottom bottom", end: "bottom 30%", scrub: true, invalidateOnRefresh: true } })
      .to(aperture, { x: () => geometry().x, y: () => geometry().y, ease: "power1.inOut", duration: 1 }, 0)
      .to(aperture, { scale: () => geometry().scale, ease: "power3.in", duration: 1 }, 0)
      .to(must(hero, ".hero__tint"), { opacity: 1, ease: "power2.in", duration: 0.6 }, 0.4)
      .to(must(hero, ".hero__orbit"), { opacity: 0, duration: 0.3 }, 0)
      .to(must(hero, ".hero__word"), { xPercent: () => (matchMedia("(min-width: 900px) and (orientation: landscape)").matches ? -14 : 0), ease: "power1.in", duration: 1 }, 0)
      .to(must(hero, ".hero__intro"), { y: -70, ease: "power1.in", duration: 1 }, 0);
  }
};

const statementScene: Task = {
  id: "scene:statement", setup() {
    const statement = byId("statement");
    const lines = all(statement, ".statement__line");
    if (adjacent("hero", "statement")) {
      gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "statement:entry", trigger: statement, start: "top bottom", end: "top 30%", scrub: true } })
        .fromTo(lines, { yPercent: 85, xPercent: (index: number) => (index ? 9 : -6) }, { yPercent: 0, xPercent: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 0)
        .fromTo(must(statement, ".statement__dot"), { scale: 0 }, { scale: 1, duration: 0.1 }, 0.9);
    }
    gsap.fromTo(
      all(statement, ".statement__index li"),
      { yPercent: 40, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.07,
        ease: "expo.out",
        clearProps: "opacity,transform",
        scrollTrigger: { id: "statement:index", trigger: must(statement, ".statement__index"), start: "top 88%", once: true },
      }
    );
  }
};

const workScene: Task = {
  id: "scene:work", setup() {
    const work = document.getElementById("work");
    if (!work) return;
    const track = must(work, ".work__track");
    const frame = must(work, ".work__window");
    const stage = must(work, ".work__stage");
    work.classList.add("is-track");
    const run = () => Math.max(0, track.offsetWidth - (work.clientWidth - 2 * parseFloat(getComputedStyle(stage).paddingLeft)));
    const setRun = () => work.style.setProperty("--run", `${Math.round(run())}px`);
    setRun();
    ScrollTrigger.addEventListener("refreshInit", setRun);
    gsap.fromTo(must(work, ".work__plate"), { clipPath: "inset(0% 3.2% 0% 3.2% round 44px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power1.out", scrollTrigger: { id: "work:plate", trigger: work, start: "top bottom", end: "top 15%", scrub: true } });
    const timeline = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "work", trigger: work, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
    timeline.to(track, { x: () => -run() }, 0);
    all(work, ".case__img").forEach(image => timeline.fromTo(image, { xPercent: -5 }, { xPercent: 5 }, 0));
    if (adjacent("work", "again")) {
      const cases = all(track, ".case");
      const radius = () => (innerWidth < 700 ? innerWidth * 2.1 : innerWidth * 0.95);
      // Where a card sits on the big circle the cases roll onto as the section ends.
      const bend = (card: HTMLElement) => {
        const offset = layoutBox(frame).x + card.offsetLeft + card.offsetWidth / 2 - run() - innerWidth / 2;
        const angle = offset / radius();
        return { x: radius() * Math.sin(angle) - offset, y: radius() * (1 - Math.cos(angle)), rotation: (angle * 180) / Math.PI };
      };
      const exit = gsap.timeline({ defaults: { ease: "power1.in" }, scrollTrigger: { id: "work:exit", trigger: work, start: "bottom bottom", end: "bottom 30%", scrub: true, invalidateOnRefresh: true } });
      exit.to(frame, { x: () => -innerWidth * 0.2, duration: 1 }, 0);
      cases.forEach(card => exit.to(card, { x: () => bend(card).x, y: () => bend(card).y, rotation: () => bend(card).rotation, duration: 1 }, 0));
    }
    return () => { work.classList.remove("is-track"); work.style.removeProperty("--run"); ScrollTrigger.removeEventListener("refreshInit", setRun); };
  }
};

const againScene: Task = {
  id: "scene:again", setup() {
    const again = byId("again");
    const stage = must(again, ".again__stage");
    const head = must(again, ".again__head");
    const swing = must(again, ".again__swing");
    const wheel = must(again, ".again__wheel");
    const cards = all(wheel, ".partner");
    again.classList.add("is-wheel");
    cards.forEach((card, index) => card.style.setProperty("--i", String(index)));
    let step = 0, arcTop = 0, radius = 1;
    const measure = () => {
      const width = innerWidth, height = stage.offsetHeight;
      const headBottom = head.offsetTop + head.offsetHeight;
      const room = height - headBottom - innerHeight * 0.04;
      const card = Math.max(180, Math.min(width * (width < 700 ? 0.7 : 0.28), (room - 32) / 1.25));
      arcTop = headBottom + Math.max(28, (room - card * 1.25) * 0.4);
      radius = Math.max(width * 0.95, card * 3.3);
      step = (2 * Math.asin((card + Math.max(18, width * 0.024)) / (2 * radius)) * 180) / Math.PI;
      again.style.setProperty("--card", `${card.toFixed(1)}px`);
      again.style.setProperty("--radius", `${radius.toFixed(1)}px`);
      again.style.setProperty("--step", `${step.toFixed(3)}deg`);
      again.style.setProperty("--arc-top", `${arcTop.toFixed(1)}px`);
      again.style.setProperty("--spin", `${Math.round(cards.length * innerHeight * 0.42)}px`);
    };
    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);
    gsap.fromTo(wheel, { rotation: () => step * 0.55 }, { rotation: () => -(cards.length - 0.45) * step, ease: "none", scrollTrigger: { id: "again", trigger: again, start: "top 30%", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
    const plate = again.querySelector(".again__plate") as HTMLElement | null;
    if (plate) {
      gsap.fromTo(plate, { clipPath: "inset(0% 3.2% 0% 3.2% round 44px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power1.out", scrollTrigger: { id: "again:plate", trigger: again, start: "top bottom", end: "top 15%", scrub: true } });
    }
    if (adjacent("statement", "again") || adjacent("work", "again")) {
      gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "again:entry", trigger: again, start: "top bottom", end: "top 30%", scrub: true, invalidateOnRefresh: true } })
        .fromTo(swing, { rotation: () => Math.max(4, (Math.asin(Math.min(1, innerWidth * 0.3 / radius)) * 180) / Math.PI - step * 0.55) }, { rotation: 0, ease: "power1.out" }, 0)
        .fromTo(swing, { y: () => -(arcTop - 40) }, { y: 0, ease: "power2.in" }, 0)
        .fromTo(head, { yPercent: 45 }, { yPercent: 0, ease: "power2.out" }, 0);
    }
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", measure);
      again.classList.remove("is-wheel");
      ["--card", "--radius", "--step", "--arc-top", "--spin"].forEach(name => again.style.removeProperty(name));
      cards.forEach(card => card.style.removeProperty("--i"));
    };
  }
};

const capabilitiesScene: Task = {
  id: "scene:capabilities", setup() {
    const section = byId("capabilities");
    const cards = all(section, ".service");
    section.classList.add("is-deck");
    cards.forEach((card, index) => card.style.setProperty("--i", String(index)));
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!next) return;
      gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: `capabilities:${index}`, trigger: next, start: "top bottom", end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`, scrub: true, invalidateOnRefresh: true } })
        .to(card, { scale: 0.9 }, 0)
        .to(must(card, ".service__shade"), { opacity: 0.55 }, 0);
    });
    return () => { section.classList.remove("is-deck"); cards.forEach(card => card.style.removeProperty("--i")); };
  }
};

const methodScene: Task = {
  id: "scene:method", setup() {
    const method = byId("method");
    const steps = all(method, ".step");
    const stations = all(method, ".method__station");
    method.classList.add("is-cycle");
    const timeline = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "method", trigger: must(method, ".method__steps"), start: "top 62%", end: "bottom 62%", scrub: true } });
    timeline.fromTo(must(method, ".method__arc"), { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1 }, 0)
      .fromTo(must(method, ".method__arm"), { rotation: 0 }, { rotation: 360, duration: 1 }, 0);
    steps.forEach((step, index) => {
      const at = index / steps.length;
      timeline.fromTo(step, { opacity: 0.2 }, { opacity: 1, duration: 0.07 }, Math.max(0, at - 0.03));
      if (stations[index]) timeline.fromTo(stations[index], { scale: 0.4 }, { scale: 1.35, duration: 0.05, ease: "back.out(3)" }, at).to(stations[index], { scale: 1, duration: 0.08 }, at + 0.06);
    });
    return () => method.classList.remove("is-cycle");
  }
};

const studioScene: Task = {
  id: "scene:studio", setup() {
    const collage = document.querySelector("#studio .studio__collage") as HTMLElement | null;
    if (!collage) return;
    const shots = all(collage, ".shot");
    const tilt = [-8, 6, -4, 9, -6];
    const offset = (shot: HTMLElement, axis: "x" | "y") => {
      const centre = axis === "x" ? collage.offsetWidth / 2 : Math.min(collage.offsetHeight / 2, innerHeight * 0.45);
      const own = axis === "x" ? shot.offsetLeft + shot.offsetWidth / 2 : shot.offsetTop + shot.offsetHeight / 2;
      return centre - own;
    };
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { id: "studio", trigger: collage, start: "top 82%", end: () => (innerWidth < 900 ? "top 10%" : "center 55%"), scrub: true, invalidateOnRefresh: true } });
    shots.forEach((shot, index) => timeline.fromTo(shot, { x: () => offset(shot, "x"), y: () => offset(shot, "y"), rotation: tilt[index % tilt.length], scale: 0.66 }, { x: 0, y: 0, rotation: 0, scale: 1, duration: 1 }, (shots.length - 1 - index) * 0.08));
  }
};

const journalScene: Task = {
  id: "scene:journal", setup() {
    const journal = document.getElementById("journal");
    if (!journal) return;
    const shots = all(journal, ".journal__shot");
    const stories = all(journal, ".story");
    journal.classList.add("is-swap");
    stories.forEach((story, index) => {
      const timeline = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: `journal:${index}`, trigger: story, start: "top 84%", end: "top 50%", scrub: true } });
      timeline.fromTo(story, { opacity: 0.25 }, { opacity: 1, duration: 0.8 }, 0);
      if (index && shots[index]) timeline.fromTo(shots[index], { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power1.inOut", duration: 1 }, 0);
    });
    return () => journal.classList.remove("is-swap");
  }
};

const contactScene: Task = {
  id: "scene:contact", setup() {
    const contact = byId("contact");
    gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "contact", trigger: contact, start: "top bottom", end: "top 15%", scrub: true } })
      .fromTo(must(contact, ".contact__voice"), { fontWeight: 400, scale: 0.82, transformOrigin: "0% 100%" }, { fontWeight: 800, scale: 1, duration: 1 }, 0)
      .fromTo(must(contact, ".contact__title .m-dot"), { scale: 0, yPercent: -400 }, { scale: 1, yPercent: 0, duration: 0.25, ease: "power2.in" }, 0.75);
  }
};

const footerScene: Task = {
  id: "scene:footer", setup() {
    const footer = byId("footer");
    const aperture = must(footer, ".footer__aperture");
    const dot = () => must(footer, ".footer__period").offsetWidth / aperture.offsetWidth;
    gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { id: "footer", trigger: must(footer, ".footer__bye"), start: "bottom bottom", end: "bottom 55%", scrub: true, invalidateOnRefresh: true } })
      .fromTo(aperture, { scale: dot }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .fromTo(must(footer, ".footer__tint"), { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.45)
      .fromTo(must(footer, ".footer__word"), { yPercent: 30 }, { yPercent: 0, ease: "power2.out", duration: 0.8 }, 0);
  }
};

// ---------------------------------------------------------------- queue

const nextTask = (): Promise<void> => (window as Window & { scheduler?: { yield?: () => Promise<void> } }).scheduler?.yield?.() ?? new Promise(resolve => setTimeout(resolve));

/**
 * Builds the scenes after the fonts are in (so measurements are right): above-the-fold tasks first,
 * the rest one per task so the main thread is never blocked for long, then a single ScrollTrigger refresh.
 * A scene that throws is undone (its classes, styles and tweens) so one failure cannot break the page.
 */
function runTasks(tasks: Task[]) {
  let alive = true;
  const media: ReturnType<typeof gsap.matchMedia>[] = [];

  const execute = (task: Task) => {
    for (const trigger of ScrollTrigger.getAll()) {
      if (!trigger.end && ScrollTrigger.getAll().includes(trigger)) (trigger as unknown as { refresh(soft: number, force: number): void }).refresh(0, 1);
    }
    const mm = gsap.matchMedia();
    const log = new MutationObserver(() => { });
    log.observe(document.documentElement, { attributes: true, attributeOldValue: true, subtree: true });
    let failure: unknown = null;
    let records: MutationRecord[];
    try { mm.add(NO_PREFERENCE, () => { try { return task.setup(); } catch (error) { failure = error; } }); }
    finally { records = log.takeRecords(); log.disconnect(); }
    if (!failure) { media.push(mm); return true; }
    try { mm.revert(); } catch (error) { console.error(task.id, "revert failed", error); }
    for (const { target, attributeName, oldValue } of records.reverse()) {
      if (!attributeName) continue;
      const element = target as Element;
      const now = element.getAttribute(attributeName);
      if (oldValue == null) { if (now != null) element.removeAttribute(attributeName); }
      else if (now !== oldValue) element.setAttribute(attributeName, oldValue);
    }
    console.error(task.id, failure);
    return false;
  };

  const refresh = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };

  (async () => {
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    if (!alive) return;
    for (const task of tasks.filter(t => t.first)) if (alive && !execute(task)) refresh();
    for (const task of tasks.filter(t => !t.first)) {
      await nextTask();
      if (!alive) return;
      execute(task);
    }
    if (alive) refresh();
  })();

  return () => { alive = false; media.forEach(mm => mm.revert()); media.length = 0; };
}

/** Marks the hero and footer while they are off screen so their endless photo spin can pause. */
function watchOffscreen(ids: string[]) {
  if (!("IntersectionObserver" in window)) return () => { };
  const observers = ids.map(id => {
    const element = document.getElementById(id);
    if (!element) return null;
    const observer = new IntersectionObserver(([entry]) => element.classList.toggle("is-offscreen", !entry.isIntersecting));
    observer.observe(element);
    return observer;
  });
  return () => observers.forEach(observer => observer?.disconnect());
}

/** Starts smooth scroll and every scene. Returns the function that undoes it all (React effect cleanup). */
export function startMotion() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const smooth = gsap.matchMedia();
  smooth.add(NO_PREFERENCE, () => {
    const nav = document.getElementById("navigation");
    const instance = (lenis = new Lenis({ lerp: 0.09, anchors: { offset: -(nav ? nav.offsetHeight : 0) } }));
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); instance.destroy(); lenis = null; };
  });

  const stopWatching = watchOffscreen(["hero", "footer"]);
  const stopTasks = runTasks([
    ...effectTasks(),
    heroScene, statementScene, workScene, againScene, capabilitiesScene, methodScene,
    studioScene, journalScene, contactScene, footerScene,
  ]);
  return () => { stopTasks(); stopWatching(); smooth.revert(); };
}
