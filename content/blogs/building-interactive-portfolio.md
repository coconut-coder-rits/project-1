# Building an Interactive Dennis Snellenberg Portfolio at 14

*Published on August 21, 2026 • 5 min read • Web Development, Motion, JavaScript*

---

## The Inspiration

When I first encountered [Dennis Snellenberg's portfolio](https://dennissnellenberg.com/), I was blown away by the level of craft, tactile feedback, and physics-driven micro-interactions. The smooth momentum cursor, the magnetic pull on buttons, and the seamless transition between dark and light themes felt completely alive.

At 14 years old, having started coding only a year ago, I challenged myself to reverse-engineer and build this entire experience from scratch using **pure Vanilla JavaScript and CSS3 transforms** — without relying on heavy third-party animation libraries like GSAP or Three.js.

```javascript
// Linear Interpolation (Lerp) for Butter-Smooth Cursor Momentum
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Running inside 60fps requestAnimationFrame
dotX += (mouseX - dotX) * 0.6;
dotY += (mouseY - dotY) * 0.6;
circleX += (mouseX - circleX) * 0.18;
circleY += (mouseY - circleY) * 0.18;
```

---

## Key Challenges Overcome

### 1. Vector Magnetic Pull
To achieve the magnetic button effect where buttons pull gently toward your cursor:
1. Calculate the bounding box center `(centerX, centerY)` on `mousemove`.
2. Compute distance offsets `(dx, dy)` and apply a weighted hardware transform `translate3d(dx * 0.35px, dy * 0.35px, 0)`.
3. On `mouseleave`, snap back using a custom cubic-bezier spring curve `cubic-bezier(0.22, 1, 0.36, 1)`.

### 2. Multi-Language 100+ Greeting Loader
Instead of a static loading bar, I engineered a high-velocity language ticker that cycles through over **100 world languages** (Spanish, French, Japanese, Mandarin, Hindi, etc.) with each numeric increment from 0 to 100%, resolving at 100% into my name.

---

## What I Learned
Building this taught me that true performance in modern web design comes from understanding the browser rendering pipeline — avoiding layout thrashing, leveraging `transform` and `opacity`, and writing clean, modular vanilla JavaScript.

*Still learning, still building, and just getting started.* ✦
