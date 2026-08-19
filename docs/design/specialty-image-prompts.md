# Wave 2 specialty images — generation work order

Six photographs, one per specialty page still to be written. Generate into the gitignored
`generated_images/` scratch folder at the repo root using the filenames below, then add the
matching config line to `scripts/optimize-editorial.mjs` and run it.

## Rules that apply to all six

**These are photographs, not illustrations.** Specialty heroes sit in the midnight `PageHero`
aside, where a flat white vector panel reads as a glaring hole. The illustration style lock in the
`careinflow-images` skill does **not** apply here.

**Do not ask the generator for a cold image.** The pipeline grades to a target b\* of 4.5 (6.0
where there is a lot of skin) and solves for the blue gain itself. Driving a photograph to b\* 0
makes it look embalmed — rooms contain wood and people contain skin. Ask for natural, neutral
clinical photography and let `optimize-editorial.mjs` do the grading.

**Aspect ratio is 3:2** (`ratio: 'wide'`), output width 900.

**No readable text anywhere.** No signage, no wall charts with legible words, no monitor text, no
logos, no name badges, no watermarks. Screens must show abstract shapes or blurred UI only. This
is the single most common failure and it is why every generated file must be opened and looked at
before it is wired in.

**People must read as Indian**, in an Indian clinical setting, dressed as clinicians here actually
dress. The existing six specialty photographs establish that register and these have to sit beside
them.

---

## 58 — Multi-specialty hospital

Highest commercial value of the six: it maps onto the ₹89,999 package. It must convey *departments
and scale*, which is what separates this buyer from a single-doctor practice.

- **Source file:** `generated_images/58-specialty-multispecialty.jpg`
- **Output:** `editorial/specialty-multispecialty.webp`
- **Config line:** `{ n: '58', src: '58-specialty-multispecialty.jpg', out: 'editorial/specialty-multispecialty.webp', ratio: 'wide', grade: 4.5, width: 900 },`
- **imageAlt:** `A bright multi-specialty hospital corridor with departmental waiting bays, staff walking between them and daylight from a high window.`

```json
{
  "task": "photorealistic editorial photograph",
  "subject": "the interior circulation space of a modern mid-sized Indian multi-specialty hospital",
  "scene": "a wide, bright main corridor with several departmental waiting bays opening off it, each bay with rows of simple seating; two nurses in scrubs walking mid-distance, one doctor in a white coat turning into a department, a family seated in the nearest bay",
  "composition": "wide establishing shot down the length of the corridor, one-point perspective, camera at standing eye level, subjects mid-distance and small in frame so the space is the subject rather than any individual",
  "depth": "deep focus, foreground and far end both readable, gentle falloff at the very back",
  "lighting": "soft diffused daylight from a high clerestory window on the left, even overhead ceiling light, no harsh speculars, no visible lamp flare",
  "camera": "35mm equivalent, f/5.6, ISO 200, eye level, tripod-steady",
  "palette": "clean neutral clinical whites and soft blue-grey surfaces, pale flooring, muted mid-blue accents on seating and door frames, natural skin tones left natural",
  "mood": "organised, calm, busy without being chaotic; a hospital that is clearly running well",
  "aspect_ratio": "3:2",
  "negative": [
    "no readable text of any kind",
    "no signage, no department name boards, no wall lettering, no numbers",
    "no logos, no brand marks, no name badges, no watermarks",
    "no legible text on any monitor or screen",
    "no beige, cream, sand, tan or gold surfaces",
    "no warm orange or yellow lighting cast",
    "no distressed or dirty surfaces, no clutter",
    "no visible patient injury, no blood, no distressing medical detail",
    "no faces in sharp close-up",
    "no illustration, no 3D render, no stock-photo posing to camera"
  ]
}
```

---

## 59 — Gynaecology

Handle with care. The page argues that privacy and discretion dominate this specialty, so the
photograph must reflect that: a consultation, never an examination.

- **Source file:** `generated_images/59-specialty-gynaecology.jpg`
- **Output:** `editorial/specialty-gynaecology.webp`
- **Config line:** `{ n: '59', src: '59-specialty-gynaecology.jpg', out: 'editorial/specialty-gynaecology.webp', ratio: 'wide', grade: 6.0, width: 900 },`
- **imageAlt:** `A woman doctor in a white coat talking with a seated patient across a desk in a private, softly lit consulting room.`

```json
{
  "task": "photorealistic editorial photograph",
  "subject": "a private, reassuring gynaecology consultation in an Indian clinic",
  "scene": "a woman doctor in a white coat seated at one side of a plain wooden desk, listening, hands relaxed; a woman patient seated across from her in ordinary clothes, seen from behind and to the side so her face is not identifiable; a closed door behind them signalling privacy",
  "composition": "medium two-shot from slightly behind the patient's shoulder, doctor in focus and facing camera-left, patient softly out of focus in the foreground edge, generous negative space above",
  "depth": "shallow depth of field, doctor sharp, foreground patient softly blurred",
  "lighting": "soft window light from camera left, warm-neutral and diffused, no overhead fluorescent harshness, gentle shadow on the far wall",
  "camera": "50mm, f/2.2, ISO 200, seated eye level",
  "palette": "muted neutrals, soft blue-grey walls, white coat, natural warm skin tones preserved, one quiet mid-blue accent in the room",
  "mood": "confidential, unhurried, respectful; a conversation rather than a procedure",
  "aspect_ratio": "3:2",
  "negative": [
    "no examination couch in use, no stirrups, no examination in progress",
    "no anatomical charts, no pregnancy diagrams, no posters",
    "no readable text, no signage, no lettering, no numbers, no logos",
    "no identifiable patient face",
    "no ultrasound imagery on a visible screen",
    "no beige, cream, sand or tan dominance",
    "no clinical coldness, no harsh white fluorescent cast",
    "no stock-photo smiling directly at camera",
    "no illustration, no 3D render"
  ]
}
```

---

## 60 — ENT

- **Source file:** `generated_images/60-specialty-ent.jpg`
- **Output:** `editorial/specialty-ent.webp`
- **Config line:** `{ n: '60', src: '60-specialty-ent.jpg', out: 'editorial/specialty-ent.webp', ratio: 'wide', grade: 4.5, width: 900 },`
- **imageAlt:** `An ENT specialist examining the ear of a seated adult patient with a handheld otoscope in a tidy consulting room.`

```json
{
  "task": "photorealistic editorial photograph",
  "subject": "an ENT examination in an Indian outpatient consulting room",
  "scene": "a doctor in a white coat leaning in to examine the ear of a calm seated adult patient using a handheld otoscope; a simple instrument tray beside them holding a head mirror and specula; plain wall behind",
  "composition": "medium shot from the side, both figures in frame from the chest up, doctor camera-right and patient camera-left, the line of the examination running across the frame",
  "depth": "shallow depth of field, the point of examination sharp, background falling away softly",
  "lighting": "focused clinical task light on the examination point, ambient daylight filling the rest of the room, clear separation between the lit action and the quiet background",
  "camera": "50mm, f/2.5, ISO 320, seated eye level",
  "palette": "cool neutral room, stainless instruments, white coat, natural skin tones, one muted blue accent",
  "mood": "precise, routine, calm; a practised everyday examination",
  "aspect_ratio": "3:2",
  "negative": [
    "no readable text, no signage, no lettering, no numbers, no logos",
    "no anatomical ear or throat posters with legible labels",
    "no endoscope monitor showing recognisable internal imagery",
    "no visible discomfort or distress on the patient",
    "no blood, no discharge, no distressing clinical detail",
    "no beige, cream, sand or tan dominance",
    "no harsh green or yellow lighting cast",
    "no stock-photo posing to camera",
    "no illustration, no 3D render"
  ]
}
```

---

## 61 — Cardiology

- **Source file:** `generated_images/61-specialty-cardiology.jpg`
- **Output:** `editorial/specialty-cardiology.webp`
- **Config line:** `{ n: '61', src: '61-specialty-cardiology.jpg', out: 'editorial/specialty-cardiology.webp', ratio: 'wide', grade: 4.5, width: 900 },`
- **imageAlt:** `A cardiologist explaining an ECG trace on a screen to a middle-aged patient seated beside the desk.`

```json
{
  "task": "photorealistic editorial photograph",
  "subject": "a cardiologist explaining a result to a patient in an Indian consulting room",
  "scene": "a doctor in a white coat with a stethoscope turned toward a wall-mounted or desk monitor showing an abstract waveform trace, gesturing at it while explaining; a middle-aged patient seated beside the desk following the explanation; an echo machine partly visible at the edge of frame",
  "composition": "medium two-shot at a three-quarter angle, doctor camera-right gesturing toward the screen at camera-left, patient between them and slightly forward, the screen glow anchoring the composition",
  "depth": "moderate depth of field, both figures readable, the equipment behind softly out of focus",
  "lighting": "cool screen light on the faces from camera left, soft daylight fill from behind, no harsh overhead",
  "camera": "50mm, f/2.8, ISO 400, seated eye level",
  "palette": "cool clinical blues and greys, white coat, dark monitor bezel, natural skin tones, muted blue-green trace on the screen",
  "mood": "serious but reassuring; a decision being explained rather than delivered",
  "aspect_ratio": "3:2",
  "negative": [
    "no readable text, no numbers, no measurements, no labels on the screen",
    "no recognisable ECG grid with legible values, waveform must read as abstract",
    "no signage, no wall lettering, no logos, no name badges",
    "no anatomical heart poster with legible labels",
    "no alarm states, no red warning colours, no emergency scene",
    "no patient in a hospital bed, no distress",
    "no beige, cream, sand or tan dominance",
    "no stock-photo posing to camera",
    "no illustration, no 3D render"
  ]
}
```

---

## 62 — Mental health

The most compliance-sensitive image on the site. It must read as an ordinary professional
conversation, never as illness, restraint, medication or despair.

- **Source file:** `generated_images/62-specialty-mental-health.jpg`
- **Output:** `editorial/specialty-mental-health.webp`
- **Config line:** `{ n: '62', src: '62-specialty-mental-health.jpg', out: 'editorial/specialty-mental-health.webp', ratio: 'wide', grade: 6.0, width: 900 },`
- **imageAlt:** `Two comfortable chairs facing each other by a window in a calm consulting room, a therapist and a client mid-conversation.`

```json
{
  "task": "photorealistic editorial photograph",
  "subject": "a calm, ordinary therapy consultation in an Indian private practice",
  "scene": "two comfortable upholstered chairs angled toward each other beside a tall window; a therapist in plain professional clothes, not a white coat, listening with an open posture; a client seated opposite, seen from behind so they are not identifiable; a low side table with a plant and a glass of water",
  "composition": "wide-medium shot taking in the whole seating arrangement and the window, camera at seated height, the two figures balanced left and right with the window between them",
  "depth": "moderate depth of field, both chairs and the window readable, background wall soft",
  "lighting": "generous soft daylight through a sheer curtain, low contrast, no overhead clinical lighting at all, the room lit like a living space",
  "camera": "35mm, f/2.8, ISO 200, seated height",
  "palette": "muted soft neutrals, dusty blue upholstery, pale wall, green plant, natural skin tones, deliberately gentle and low-saturation",
  "mood": "private, unhurried, unclinical; two people talking, nothing more",
  "aspect_ratio": "3:2",
  "negative": [
    "no identifiable client face",
    "no couch or reclining psychoanalysis cliche",
    "no medication, no pill bottles, no prescription pads",
    "no head-in-hands posture, no crying, no visible distress",
    "no clipboard being written on, no note-taking that reads as assessment",
    "no readable text, no signage, no lettering, no logos, no book titles",
    "no brain imagery, no puzzle pieces, no ribbon symbols, no metaphor props",
    "no hospital or institutional setting, no white coat",
    "no beige, cream, sand or tan dominance",
    "no illustration, no 3D render"
  ]
}
```

---

## 63 — Diagnostic centre

Different buyer from the rest: referral-driven from doctors rather than patient-driven. The
photograph should read as capability and throughput.

- **Source file:** `generated_images/63-specialty-diagnostics.jpg`
- **Output:** `editorial/specialty-diagnostics.webp`
- **Config line:** `{ n: '63', src: '63-specialty-diagnostics.jpg', out: 'editorial/specialty-diagnostics.webp', ratio: 'wide', grade: 4.0, width: 900 },`
- **imageAlt:** `A radiographer at a scanner console in a diagnostic centre, the scanner visible through the control room window behind.`

```json
{
  "task": "photorealistic editorial photograph",
  "subject": "the control room of a modern Indian diagnostic imaging centre",
  "scene": "a radiographer in scrubs seated at a console of two monitors showing abstract greyscale imagery, one hand on the desk; through a large window behind, a CT or MRI scanner gantry in a softly lit adjoining room",
  "composition": "medium shot from behind and to the side of the radiographer, over-the-shoulder framing so the console and the window beyond are both in frame, the scanner reading as the destination of the look",
  "depth": "moderate depth of field, radiographer and console sharp, scanner room softly out of focus behind the glass",
  "lighting": "low ambient room light, cool monitor glow on the radiographer, brighter even light in the scanner room beyond creating separation through the window",
  "camera": "35mm, f/2.8, ISO 640, seated eye level",
  "palette": "cool blue-greys throughout, dark console surfaces, pale scanner housing, muted greyscale on the monitors, natural skin tones",
  "mood": "technical, quiet, competent; a place that processes volume accurately",
  "aspect_ratio": "3:2",
  "negative": [
    "no readable text, no patient names, no measurements, no labels, no numbers",
    "no recognisable diagnostic image, scan imagery must read as abstract greyscale",
    "no manufacturer branding on the scanner or monitors, no logos, no model names",
    "no patient visible inside the scanner, no patient distress",
    "no red or amber warning lights, no alarm state",
    "no beige, cream, sand or tan dominance",
    "no warm tungsten cast",
    "no stock-photo posing to camera",
    "no illustration, no 3D render"
  ]
}
```

---

## After generating

1. **Open every file and look at it.** Check for text artifacts, stray brand marks, warm colour
   drift and anatomical oddities in hands and faces. Regenerate rather than ship a near-miss.
2. Add the six config lines to the specialty block in
   [scripts/optimize-editorial.mjs](../../scripts/optimize-editorial.mjs) and run it. The script
   logs the before and after b\* for each file, so confirm each lands near its target.
3. Wire each into its specialty MDX `image` / `imageAlt` frontmatter.
4. `npm run build && npm run verify`, then check the page at 320px and 1440px.

The sources stay in `generated_images/`, which is gitignored deliberately: the drop is roughly
17 MB of JPEG against ~2 MB of committed output, and Cloudflare re-clones this repo on every push.
The config lines are the record of how each asset was made.
