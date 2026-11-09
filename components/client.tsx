"use client";

// The only interactive pieces of the page: phone menu, the two forms and the motion starter.
// Everything else is rendered on the server (app/page.tsx).
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { getLenis, startMotion } from "@/lib/motion";
import { contactEmail } from "@/lib/site";

/** Starts smooth scroll and the scroll scenes once the page is on screen. */
export function Motion() {
  useEffect(() => startMotion(), []);
  return null;
}

type NavLink = { href: string; label: string };

/** Fixed top bar (wordmark, section links, button) and the full-screen phone menu. */
export function Navigation({ links }: { links: readonly NavLink[] }) {
  const [open, setOpenState] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  const setOpen = (next: boolean, restoreFocus = true) => {
    flushSync(() => setOpenState(next)); // the menu must be visible before it can take focus
    if (next) { getLenis()?.stop(); close.current?.focus(); }
    else { getLenis()?.start(); if (restoreFocus) toggle.current?.focus(); }
  };

  // Keep Tab inside the open menu; Escape closes it.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key ==="Escape") setOpen(false);
    if (event.key !=="Tab" || !menu.current) return;
    const items = [...menu.current.querySelectorAll<HTMLElement>("a, button")];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return (
    <header id="navigation" data-8b-section="navigation" className="nav pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center gap-3 px-(--space-1) py-3.5 *:pointer-events-auto">
      <a className="inline-flex min-h-12 items-center gap-2 rounded-pill bg-ink px-[14px] font-display text-[length:clamp(17px,5vw,25px)] font-extrabold leading-[1.2] tracking-[-0.05em] text-paper no-underline" href="#hero" aria-label="Manish Gupta, back to the top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="size-8 flex-none rounded-full object-cover" src="/logo.webp" width={32} height={32} alt="Manish Gupta" />
        <span className="pt-[3px]">Manish Gupta<span className="m-dot" aria-hidden="true" /></span>
      </a>
      <nav className="mx-auto rounded-pill bg-ink px-2 text-paper max-[899px]:hidden" aria-label="Main">
        <ul className="flex">
          {links.map(link => (
            <li key={link.href}><a className="m-link-2 mx-3.5 block py-3.5 after:bottom-2.5" href={link.href}>{link.label}</a></li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <a
          className="group inline-flex min-h-12 items-center gap-2 rounded-pill bg-paper px-4 sm:px-5 font-body text-sm sm:text-base font-bold text-ink shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.03] hover:bg-flame hover:text-white active:scale-[0.98]"
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Resume"
        >
          <svg className="size-4 text-flame group-hover:text-white flex-none transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Resume</span>
        </a>
        <a className="m-btn shadow-[0_0_0_2px_var(--color-ink)] max-[899px]:hidden" href="#contact"><span className="m-btn__label">Get in touch</span></a>
      </div>
      <div ref={menu} className="menu fixed inset-0 z-60 grid grid-rows-[auto_1fr_auto] overflow-y-auto bg-ink px-(--space-1) pt-3.5 pb-8 text-paper" id="menu" role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent hidden={!open} onKeyDown={onKeyDown}>
        <div className="flex justify-end">
          <button ref={close} className="m-icon" type="button" aria-label="Close the menu" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" /></svg>
          </button>
        </div>
        <ul className="grid gap-1.5 self-center">
          {[...links, { href: "#contact", label: "Contact" }].map(link => (
            <li key={link.href}>
              <a className="font-display text-[length:clamp(42px,13vw,72px)] font-extrabold leading-none tracking-[-0.05em] no-underline" href={link.href} onClick={() => setOpen(false, false)}>
                {link.label}<span className="m-dot" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className="m-text text-fog">AI Engineer &amp; Full-Stack Developer</p>
      </div>
    </header>
  );
}

const CONTACT_SUCCESS = "Your message has been sent successfully!";
const CONTACT_ERROR = "Please provide your name, a valid email address, and a message.";
const CONTACT_SENDING = "Sending message…";
const CONTACT_FAILED = "Unable to send your message. Please try again or email directly.";

/**
 * Contact form delivering messages directly to m09167358@gmail.com via /api/contact
 * with automatic fallback.
 */
export function ContactForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const form = formRef.current || event.currentTarget;
    const formData = new FormData(form);

    // Honeypot check: drop silently if filled
    const honeypot = formData.get("website");
    if (honeypot) return;

    // Validation
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const purpose = String(formData.get("purpose") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !emailRegex.test(email) || !message) {
      setStatus(CONTACT_ERROR);
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }

    setSending(true);
    setStatus(CONTACT_SENDING);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subject || "Portfolio Message",
          topic: purpose || "Project Collaboration",
          message,
        }),
      });

      if (res.ok) {
        setSending(false);
        setStatus(CONTACT_SUCCESS);
        form.reset();
      } else {
        // Fallback directly to FormSubmit for m09167358@gmail.com
        const fallbackRes = await fetch("https://formsubmit.co/ajax/m09167358@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name,
            email,
            subject: `Portfolio Message: ${subject || "General Inquiry"}`,
            topic: purpose,
            message,
            _captcha: "false",
          }),
        }).catch(() => null);

        if (fallbackRes && fallbackRes.ok) {
          setSending(false);
          setStatus(CONTACT_SUCCESS);
          form.reset();
        } else {
          setSending(false);
          setStatus(CONTACT_FAILED);
        }
      }
    } catch {
      setSending(false);
      setStatus(CONTACT_FAILED);
    }
  };

  const label = "grid gap-1 text-slate text-xs sm:text-sm font-semibold";
  return (
    <form
      ref={formRef}
      className="contact__form rounded-[28px] sm:rounded-[36px] bg-white grid gap-[20px] p-[clamp(24px,3.5vw,44px)] shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
      noValidate
      onSubmit={onSubmit}
    >
        <div className="grid gap-[20px] min-[640px]:grid-cols-2">
          <label className={label}>Your name<input className="m-field text-ink" name="name" type="text" autoComplete="name" required /></label>
          <label className={label}>Email<input className="m-field text-ink" name="email" type="email" autoComplete="email" required /></label>
        </div>
        <div className="grid gap-[20px] min-[640px]:grid-cols-2">
          <label className={label}>Subject<input className="m-field text-ink" name="subject" type="text" placeholder="" /></label>
          <label className={label}>
            What are you reaching out for?
            <select className="m-field text-ink cursor-pointer" name="purpose" defaultValue="Project Collaboration">
              <option value="Project Collaboration">Project Collaboration</option>
              <option value="Freelance Work">Freelance Work</option>
              <option value="AI & LLM Solutions">AI & LLM Solutions</option>
              <option value="Full-time Role">Full-time Role</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </label>
        </div>
        <label className={label}>Your message<textarea className="m-field text-ink" name="message" rows={3} required /></label>
        <input className="hidden" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
        <div className="flex flex-wrap items-center gap-4 pt-1.5">
          <button className="m-btn disabled:opacity-60" type="submit" disabled={sending}>
            <span className="m-btn__label">{sending ? "Sending…" : "Send message"}</span>
          </button>
          <p className="m-text text-ink text-sm" role="status" aria-live="polite" data-success={CONTACT_SUCCESS} data-error={CONTACT_ERROR}>{status}</p>
        </div>
      </form>
  );
}

const NEWS_IDLE ="Enter your email to follow the news.";
const NEWS_SUCCESS ="You are in. Thank you.";
const NEWS_ERROR ="Please enter a valid email address.";

/** Newsletter field in the footer. Like the contact form it only validates for now. */
export function NewsletterForm() {
  const [note, setNote] = useState(NEWS_IDLE);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const ok = form.checkValidity();
    setNote(ok ? NEWS_SUCCESS : NEWS_ERROR);
    if (ok) form.reset();
  };

  return (
    <form data-8b-placeholder="form" className="col-span-full grid gap-3.5 min-[900px]:col-auto" noValidate onSubmit={onSubmit}>
      <label className="m-text-7" htmlFor="news-email">Tech news in your inbox<span className="m-dot" aria-hidden="true" /></label>
      <div className="flex items-center gap-3">
        <input className="m-field flex-1" id="news-email" name="email" type="email" autoComplete="email" placeholder="Your email" required />
        <button className="m-icon" type="submit" aria-label="Subscribe"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg></button>
      </div>
      <p className="m-text-6 text-fog" role="status" aria-live="polite" data-idle={NEWS_IDLE} data-success={NEWS_SUCCESS} data-error={NEWS_ERROR}>{note}</p>
    </form>
  );
}
