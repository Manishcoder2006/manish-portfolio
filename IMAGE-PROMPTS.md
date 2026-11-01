# Image prompts for YourDevelopers

All 26 photos on the site are still the design-agency template's Unsplash photos. This file has one prompt per slot, in page order.

**How to use:** paste the **style line** at the end of every prompt so the set looks consistent. Generate each image at the given ratio, export it as JPG (or WebP) at the given size, and save it in `public/images/` under the given filename. Once the files are there, `lib/photos.ts` can be switched from Unsplash to them.

**Priority:** *Replace* = wrong for a tech community (bikes, bakery, museum, purple shapes…). *Optional* = acceptable for now, but off-brand next to the new set.

---

## Style line (append to every prompt)

> Photorealistic editorial photography, warm amber and orange light (#F8B808 to #F5871A) against deep black shadows, high contrast, cinematic, shallow depth of field, modern and diverse people in casual tech clothing, candid and natural, no text, no readable words on screens or signs, no logos, no watermarks.

Screens: ask for "blurred abstract code" so the generator doesn't produce garbled text.

---

## Hero and footer (round crop, slowly rotating)

These sit in a circle that **spins slowly**, so they need to be abstract and radially balanced: no people, no horizon.

| File | Ratio / size | Priority | Prompt |
|---|---|---|---|
| `hero.jpg` | 1:1 · 1200×1200 | **Replace** (purple) | Abstract 3D sculpture of flowing glossy liquid metal ribbons swirling around a centre point, molten amber to deep orange gradient, soft studio reflections, pure black background, centred composition, radially balanced, macro render, octane style |
| `footer.jpg` | 1:1 · 1200×1200 | **Replace** (purple) | Abstract 3D geometric form made of interlocking angular folded planes like origami, glowing amber to orange gradient edges, glossy surfaces, pure black background, centred and radially balanced, studio lighting, minimal |

## What we run (`#work`): wide cards, text over the bottom third

Keep the **lower third dark and simple**: the card title and line sit on top of it.

| File | Ratio / size | Card | Priority | Prompt |
|---|---|---|---|---|
| `work-events.jpg` | 16:10 · 1600×1000 | Events | **Replace** (museum) | Wide shot of a hackathon at night, dozens of developers working in small teams at long tables with laptops, warm orange string lights and amber stage glow, energetic but focused, dark room, darker foreground |
| `work-news.jpg` | 16:10 · 1600×1000 | Tech news | **Replace** (billboard) | Developer in a dark room reading on a laptop and phone, faces lit by warm orange screen glow, blurred abstract charts and code on the screens, moody, cinematic, darker lower third |
| `work-help.jpg` | 16:10 · 1600×1000 | Developer help | Optional | Two developers pair programming at one monitor, one pointing at the screen and explaining, the other smiling with understanding, warm desk lamp light, blurred abstract code, dark background |
| `work-support.jpg` | 16:10 · 1600×1000 | Tech support | **Replace** (lilac wall) | Close-up of hands typing in a terminal on a laptop next to an open server rack with neat cables and amber status LEDs, warm side light, black background, shallow depth of field |
| `work-ai.jpg` | 16:10 · 1600×1000 | AI | **Replace** (headphones) | Abstract visualisation of a neural network: thousands of glowing amber and orange nodes connected by fine light threads, forming a flowing wave across a black void, depth of field, cinematic |

## Made for developers (`#again`): portrait cards, text over the bottom two thirds

People in the **upper half** of the frame, simple dark area below.

| File | Ratio / size | Card | Priority | Prompt |
|---|---|---|---|---|
| `again-learning.jpg` | 4:5 · 900×1125 | Just starting out | **Replace** | Young beginner developer at a laptop at night, curious expression, notebook with handwritten sketches beside them, warm orange lamp light, face in upper half of frame, dark lower half |
| `again-building.jpg` | 4:5 · 900×1125 | Shipping a project | **Replace** | Confident developer leaning back from two monitors in a home studio, satisfied smile after a launch, amber backlight, blurred abstract code, subject in upper half, dark lower half |
| `again-stuck.jpg` | 4:5 · 900×1125 | Hitting a wall | **Replace** (arcade) | Developer with hands on head staring at a screen full of blurred red-and-orange error lines, late night, dramatic warm side light, empathetic not comic, subject in upper half |
| `again-leading.jpg` | 4:5 · 900×1125 | Running a team | **Replace** | Tech lead standing at a whiteboard covered in system-design diagrams (no readable text) explaining to a small team, warm amber office light, portrait framing, dark lower half |
| `again-ai.jpg` | 4:5 · 900×1125 | Trying out AI | **Replace** (purple) | Developer's face softly lit by an orange holographic glow of abstract flowing particles floating above their laptop, wonder and focus, black background, portrait framing |
| `again-current.jpg` | 4:5 · 900×1125 | Keeping up | **Replace** | Developer with headphones reading tech news on a tablet on a night train or café window seat, warm city lights bokeh in orange, calm, subject in upper half |

## How we help (`#capabilities`): photos on pale cards, no text over them

| File | Ratio / size | Card | Priority | Prompt |
|---|---|---|---|---|
| `help-events.jpg` | 4:3 · 1200×900 | Events | Optional | Speaker on a small stage at a developer meetup presenting to an engaged audience seen from behind, big screen with blurred abstract slides, warm orange stage lighting, dark venue |
| `help-news.jpg` | 4:3 · 1200×900 | Tech news | **Replace** (printed box) | Top-down flat lay on a black desk: open laptop with blurred news layout, phone, mechanical keyboard, coffee cup, notebook, warm amber light raking across, minimal and tidy |
| `help-dev.jpg` | 4:3 · 1200×900 | Developer help | Optional | Mentor and junior developer side by side at a laptop in a community space, mentor gesturing at the code, both smiling, warm orange accent lights, dark background |
| `help-support.jpg` | 4:3 · 1200×900 | Tech support | **Replace** (food app) | Technician's hands replacing a component inside an open laptop on an anti-static mat, precision screwdriver, warm amber work light, black background, macro detail |
| `help-ai.jpg` | 4:3 · 1200×900 | AI | **Replace** (violet) | Abstract glowing amber circuit-board pattern that morphs into an organic brain-like form, orange light trails on black, high detail, 3D render |

## The community (`#studio`): five-photo collage

| File | Ratio / size | Priority | Prompt |
|---|---|---|---|
| `community-1.jpg` | 3:2 · 1400×933 | **Replace** | Group of diverse developers celebrating around laptops at the end of a hackathon, cheering and high-fiving, confetti in orange light, wide shot, warm and joyful |
| `community-2.jpg` | 3:4 · 900×1200 | **Replace** | Portrait of a smiling female developer wearing a lanyard at a tech event, warm orange background lights out of focus, natural candid smile |
| `community-3.jpg` | 3:4 · 900×1200 | **Replace** | Portrait of a male developer with headphones around his neck holding a laptop at a meetup, friendly expression, amber bokeh background |
| `community-4.jpg` | 3:2 · 1400×933 | **Replace** | Overhead view of a workshop table: several developers' hands, laptops, sticky notes and coffee cups, collaborative coding session, warm light, dark table |
| `community-5.jpg` | 3:2 · 1400×933 | **Replace** | One-to-one career mentoring session: experienced developer reviewing a junior's portfolio on a laptop in a quiet corner of an event, encouraging body language, warm amber light |

## Ideas and news (`#journal`): portrait frame, one per story

| File | Ratio / size | Story | Priority | Prompt |
|---|---|---|---|---|
| `news-events.jpg` | 4:5 · 1000×1250 | Events | Optional | Crowd of developers networking at an evening tech event, name badges, drinks, warm orange venue lighting, candid conversations, portrait framing |
| `news-help.jpg` | 4:5 · 1000×1250 | Help | Optional | Developer smiling while typing an answer on a laptop in a bright-to-warm café, blurred abstract code, cosy amber light, portrait framing |
| `news-tech.jpg` | 4:5 · 1000×1250 | Tech news | **Replace** (printed box) | Close-up of a hand holding a smartphone showing a blurred tech article layout, background of a dark city at night with orange lights, portrait framing |
| `news-ai.jpg` | 4:5 · 1000×1250 | AI | **Replace** (corkboard) | Developer at a desk collaborating with an AI assistant, a glowing amber abstract orb of light hovering beside the monitor, dark room, cinematic, portrait framing |

---

### Alt text

Each new photo needs an `alt` in `lib/photos.ts` that says what is actually in the image. A short version of the prompt (without the style words) works. The hero and footer images are decorative and keep `alt=""`.

### Credits

When the Unsplash photos are gone, remove their rows from `CREDITS.md` and note that the images are AI-generated (or credit the photographer if you use real event photos, which are always better for a community once you have them).
