const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
require('dotenv').config();

const htmlTheoryData = [
  // LEVEL 1 - HTML Fundamentals
  {
    levelNum: 1,
    index: 0,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `HTML (HyperText Markup Language) is the skeleton of every webpage.
It uses tags wrapped in angle brackets to define content structure.

Basic HTML boilerplate:
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </body>
</html>

Common tags:
<h1> to <h6>  — headings (h1 is largest)
<p>           — paragraph
<br>          — line break (self-closing)
<strong>      — bold text
<em>          — italic text
<hr>          — horizontal line`,
    instructions: `Create a simple HTML page with:
1. A heading that says "Welcome to CodeQuest"
2. A paragraph that says "Learning HTML is fun!"
3. Make sure your HTML is properly structured with html, head, and body tags.`,
    expectedOutput: `A page showing a heading and a paragraph`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <!-- Write your HTML here -->

  </body>
</html>`,
  },
  {
    levelNum: 1,
    index: 1,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `HTML Links and Images add interactivity and visuals.

Links using the anchor tag:
<a href="https://google.com">Click here</a>
<a href="https://google.com" target="_blank">Opens in new tab</a>

Images:
<img src="image.jpg" alt="Description of image">
The alt attribute is important for accessibility.

Lists:
Unordered list (bullet points):
<ul>
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
</ul>

Ordered list (numbered):
<ol>
  <li>First step</li>
  <li>Second step</li>
</ol>`,
    instructions: `Create an HTML page with:
1. An unordered list of 3 of your favourite programming languages
2. A link to https://developer.mozilla.org with text "Learn more at MDN"
Make sure to use proper list tags (ul and li).`,
    expectedOutput: `A page with a bullet list and a clickable link`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Links and Lists</title>
  </head>
  <body>
    <!-- Add your list and link here -->

  </body>
</html>`,
  },
  {
    levelNum: 1,
    index: 2,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `Semantic HTML uses meaningful tags that describe content purpose.
This helps browsers, search engines, and screen readers understand your page.

Semantic tags:
<header>   — top section, usually contains logo and nav
<nav>      — navigation links
<main>     — main content area
<section>  — a thematic section of content
<article>  — self-contained content (like a blog post)
<aside>    — sidebar content
<footer>   — bottom section

Non-semantic (avoid overusing):
<div>      — generic block container
<span>     — generic inline container

Example structure:
<body>
  <header><h1>My Site</h1></header>
  <nav><a href="#">Home</a></nav>
  <main>
    <section><p>Content here</p></section>
  </main>
  <footer><p>Copyright 2024</p></footer>
</body>`,
    instructions: `Build a semantic HTML page structure with:
1. A header containing an h1 with your site name
2. A nav with at least 2 links (Home, About)
3. A main section with a paragraph of content
4. A footer with copyright text`,
    expectedOutput: `A structured page with header, nav, main content, and footer`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Semantic HTML</title>
  </head>
  <body>
    <!-- Build your semantic structure here -->

  </body>
</html>`,
  },

  // LEVEL 2 - CSS Basics
  {
    levelNum: 2,
    index: 0,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS (Cascading Style Sheets) controls how HTML looks.
You can write CSS inside a <style> tag in the <head>.

CSS syntax:
selector {
  property: value;
}

Selectors:
p { }           — selects all <p> elements
.classname { }  — selects elements with class="classname"
#idname { }     — selects element with id="idname"

Common properties:
color: red;              — text color
background-color: blue;  — background color
font-size: 16px;         — text size
font-weight: bold;       — text weight
text-align: center;      — alignment
border: 1px solid black; — border

Example:
<style>
  h1 {
    color: purple;
    text-align: center;
  }
  .highlight {
    background-color: yellow;
  }
</style>`,
    instructions: `Style a webpage with CSS:
1. Make the h1 heading centered and colored in your favourite color
2. Create a class called "card" with a background color, padding of 20px, 
   and a border radius of 8px
3. Apply the card class to a div containing some text`,
    expectedOutput: `A styled page with centered heading and a card component`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>CSS Basics</title>
    <style>
      /* Write your CSS here */

    </style>
  </head>
  <body>
    <h1>Hello CSS!</h1>
    <div class="card">
      <p>I am a card component.</p>
    </div>
  </body>
</html>`,
  },
  {
    levelNum: 2,
    index: 1,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `The CSS Box Model — every element is a box with these layers:

Content → Padding → Border → Margin

padding  — space INSIDE the border (between content and border)
border   — the visible line around the element
margin   — space OUTSIDE the border (between elements)

Examples:
.box {
  padding: 20px;              /* all sides */
  padding: 10px 20px;         /* top/bottom left/right */
  padding: 5px 10px 15px 20px; /* top right bottom left */

  margin: 0 auto;             /* center a block element */

  border: 2px solid #333;
  border-radius: 8px;         /* rounded corners */

  width: 300px;
  height: 200px;

  box-sizing: border-box;     /* include padding in width */
}`,
    instructions: `Create a styled card using the box model:
1. A div with class "profile-card"
2. Give it: width 250px, padding 24px, margin auto (centered),
   a border, border-radius 12px, and a light background color
3. Inside it put an h2 name and a p description`,
    expectedOutput: `A centered profile card with proper spacing`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Box Model</title>
    <style>
      body {
        font-family: sans-serif;
        background: #f0f0f0;
      }
      /* Style your profile-card here */

    </style>
  </head>
  <body>
    <div class="profile-card">
      <h2>Your Name</h2>
      <p>Full-stack developer and coding enthusiast.</p>
    </div>
  </body>
</html>`,
  },
  {
    levelNum: 2,
    index: 2,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS Typography controls how text looks on screen.

Font properties:
font-family: 'Arial', sans-serif;   — typeface
font-size: 18px;                     — size in pixels
font-weight: bold;                   — bold / normal / 100-900
font-style: italic;                  — italic / normal
line-height: 1.6;                    — space between lines
letter-spacing: 2px;                 — space between letters
text-transform: uppercase;           — UPPERCASE / lowercase / capitalize
text-decoration: underline;          — underline / none / line-through

Colors in CSS:
color: red;                  — named color
color: #ff0000;              — hex code
color: rgb(255, 0, 0);       — RGB
color: rgba(255, 0, 0, 0.5); — RGB with opacity

Using Google Fonts (add in head):
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" 
      rel="stylesheet">`,
    instructions: `Create a styled typography showcase:
1. A large h1 title with a custom font color and letter spacing
2. A subtitle h3 that is italic and a different color
3. A paragraph with line-height of 1.8 and font-size 16px
4. One word in the paragraph wrapped in a span with a highlight color`,
    expectedOutput: `A page with beautiful typography styling`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Typography</title>
    <style>
      body {
        font-family: Georgia, serif;
        max-width: 600px;
        margin: 40px auto;
        padding: 0 20px;
      }
      /* Add your typography styles here */

    </style>
  </head>
  <body>
    <h1>The Art of Typography</h1>
    <h3>Making text beautiful</h3>
    <p>Good typography makes your website feel <span>professional</span> 
       and easy to read.</p>
  </body>
</html>`,
  },

  // LEVEL 3 - Layouts (Flexbox & Grid)
  {
    levelNum: 3,
    index: 0,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS Flexbox — powerful one-dimensional layout system.

Enable flexbox on a container:
.container {
  display: flex;
}

Main axis direction:
flex-direction: row;            /* left to right (default) */
flex-direction: column;         /* top to bottom */

Alignment:
justify-content: flex-start;    /* main axis alignment */
justify-content: center;
justify-content: space-between;
justify-content: space-around;

align-items: stretch;           /* cross axis alignment */
align-items: center;
align-items: flex-start;
align-items: flex-end;

Flex children:
flex: 1;         /* grow to fill available space */
flex: 0 0 200px; /* fixed width, don't grow or shrink */
gap: 16px;       /* space between flex items */`,
    instructions: `Build a flexbox navigation bar:
1. A nav element with display flex and space-between justify-content
2. On the left: a logo div with text "CodeQuest"
3. On the right: a ul with display flex, gap 24px, list-style none,
   and 3 li items: Home, About, Contact
4. Style it with a dark background and white text`,
    expectedOutput: `A horizontal navbar with logo on left and links on right`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Flexbox Nav</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: sans-serif; }
      /* Style your navbar here */

    </style>
  </head>
  <body>
    <nav>
      <div class="logo">CodeQuest</div>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </body>
</html>`,
  },
  {
    levelNum: 3,
    index: 1,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS Grid — two-dimensional layout system (rows AND columns).

Enable grid on a container:
.grid {
  display: grid;
}

Define columns and rows:
grid-template-columns: 200px 200px 200px;  /* 3 equal columns */
grid-template-columns: repeat(3, 1fr);     /* same, using fr unit */
grid-template-columns: 1fr 2fr 1fr;        /* proportional widths */
grid-template-rows: 100px auto;

Gaps between cells:
gap: 16px;              /* row and column gap */
column-gap: 20px;       /* only column gap */
row-gap: 10px;          /* only row gap */

Place items:
grid-column: 1 / 3;     /* span from column 1 to 3 */
grid-row: 1 / 2;        /* span row 1 */

Auto-responsive grid:
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));`,
    instructions: `Build a responsive card grid:
1. A div.grid-container with display grid
2. Use repeat(3, 1fr) for 3 equal columns with gap 20px
3. Inside, create 6 div.card elements each with:
   - A background color (alternate between 2 colors)
   - Padding 20px, border-radius 8px
   - An h3 title and a short p description`,
    expectedOutput: `A 3-column grid of cards`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>CSS Grid</title>
    <style>
      body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
      /* Style your grid here */

    </style>
  </head>
  <body>
    <div class="grid-container">
      <div class="card"><h3>Card 1</h3><p>Description here.</p></div>
      <div class="card"><h3>Card 2</h3><p>Description here.</p></div>
      <div class="card"><h3>Card 3</h3><p>Description here.</p></div>
      <div class="card"><h3>Card 4</h3><p>Description here.</p></div>
      <div class="card"><h3>Card 5</h3><p>Description here.</p></div>
      <div class="card"><h3>Card 6</h3><p>Description here.</p></div>
    </div>
  </body>
</html>`,
  },
  {
    levelNum: 3,
    index: 2,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `Centering elements is one of the most common CSS tasks.

Center with Flexbox (most common):
.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  height: 100vh;            /* full viewport height */
}

Center with Grid:
.container {
  display: grid;
  place-items: center;      /* shorthand for both axes */
  height: 100vh;
}

Center a block element horizontally:
.box {
  width: 300px;
  margin: 0 auto;
}

Center text:
.text { text-align: center; }

Positioning:
position: relative;   — positioned relative to itself
position: absolute;   — positioned relative to nearest parent
position: fixed;      — stays fixed on screen while scrolling
position: sticky;     — sticks when scrolling past it`,
    instructions: `Create a perfectly centered hero section:
1. A div.hero with full viewport height (100vh)
2. Use flexbox to center everything both horizontally and vertically
3. Inside: an h1 title, a p subtitle, and a styled button
4. Give it an attractive background (gradient or solid color)
5. Make the button have a hover effect using CSS :hover`,
    expectedOutput: `A full-screen centered hero section with a button`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Centering</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: sans-serif; }
      /* Style your hero section here */

    </style>
  </head>
  <body>
    <div class="hero">
      <h1>Welcome to CodeQuest</h1>
      <p>Learn to code through gamified challenges</p>
      <button>Start Learning</button>
    </div>
  </body>
</html>`,
  },

  // LEVEL 4 - Styling & Design
  {
    levelNum: 4,
    index: 0,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS Transitions — smooth animations between states.

Basic transition syntax:
.element {
  transition: property duration timing-function delay;
}

Examples:
.btn {
  background: blue;
  transition: background 0.3s ease;
}
.btn:hover {
  background: darkblue;
}

Transition multiple properties:
transition: color 0.3s ease, transform 0.2s ease;
transition: all 0.3s ease; /* all properties */

Timing functions:
ease        — slow start, fast middle, slow end (default)
linear      — constant speed
ease-in     — starts slow
ease-out    — ends slow
ease-in-out — slow start and end

Transform property:
transform: scale(1.1);        /* grow 10% */
transform: translateY(-5px);  /* move up 5px */
transform: rotate(45deg);     /* rotate 45 degrees */`,
    instructions: `Create an interactive button with hover effects:
1. A button with a solid background color and white text
2. On hover: change background color smoothly (0.3s transition)
3. On hover: move button up slightly using translateY(-3px)
4. Add a box-shadow on hover for a lift effect
5. Make the cursor a pointer on hover`,
    expectedOutput: `A button that smoothly animates on hover`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Transitions</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #1a1a2e;
      }
      /* Style your button with transitions here */

    </style>
  </head>
  <body>
    <button class="btn">Hover Over Me!</button>
  </body>
</html>`,
  },
  {
    levelNum: 4,
    index: 1,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS Animations — keyframe-based motion effects.

Define keyframes:
@keyframes animationName {
  0%   { property: startValue; }
  50%  { property: midValue; }
  100% { property: endValue; }
}

Apply animation:
.element {
  animation: animationName duration timing iteration;
}

Examples:
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

Animation properties:
animation-duration: 1s;
animation-iteration-count: infinite;
animation-direction: alternate;
animation-delay: 0.5s;`,
    instructions: `Create an animated loading spinner:
1. A div.spinner that is a circle (width/height 60px, border-radius 50%)
2. Give it a border that is partially colored (like a spinner arc)
3. Use @keyframes to rotate it continuously with animation: spin 1s linear infinite
4. Center it on the page
5. Also add a "Loading..." text below it that fades in and out`,
    expectedOutput: `An animated spinning loader on screen`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>CSS Animations</title>
    <style>
      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #0d1117;
        color: white;
        font-family: sans-serif;
        gap: 20px;
      }
      /* Create your spinner animation here */

    </style>
  </head>
  <body>
    <div class="spinner"></div>
    <p class="loading-text">Loading...</p>
  </body>
</html>`,
  },
  {
    levelNum: 4,
    index: 2,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `CSS Gradients and Custom Properties (variables).

Linear gradients:
background: linear-gradient(direction, color1, color2);
background: linear-gradient(135deg, #667eea, #764ba2);
background: linear-gradient(to right, #f093fb, #f5576c);

Radial gradients:
background: radial-gradient(circle, #667eea, #764ba2);

CSS Custom Properties (variables):
:root {
  --primary: #6c63ff;
  --secondary: #ff6584;
  --text: #333;
  --radius: 8px;
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
  color: white;
}

.button:hover {
  background: var(--secondary);
}

Benefits: change one variable and it updates everywhere!`,
    instructions: `Build a gradient theme system:
1. Define at least 4 CSS variables in :root (primary color, secondary color, 
   background, text color)
2. Create a card with a gradient background using your variables
3. A heading and paragraph inside the card using your text color variable
4. A button using your primary color variable with hover using secondary
5. The page background should use your background variable`,
    expectedOutput: `A themed page using CSS custom properties and gradients`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>CSS Variables</title>
    <style>
      :root {
        /* Define your variables here */
      }
      body {
        font-family: sans-serif;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /* Style your card and button here */

    </style>
  </head>
  <body>
    <div class="card">
      <h2>Gradient Card</h2>
      <p>Built with CSS custom properties.</p>
      <button class="btn">Click Me</button>
    </div>
  </body>
</html>`,
  },

  // LEVEL 5 - Responsive Design
  {
    levelNum: 5,
    index: 0,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `Responsive Design makes websites work on all screen sizes.

The viewport meta tag (always include in head):
<meta name="viewport" content="width=device-width, initial-scale=1.0">

Media queries — apply styles at specific screen sizes:
/* Mobile first (default styles are for mobile) */
.container { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { width: 960px; }
}

Common breakpoints:
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px

Responsive images:
img {
  max-width: 100%;
  height: auto;
}

Fluid typography:
font-size: clamp(1rem, 2.5vw, 2rem);`,
    instructions: `Create a responsive layout:
1. A .container div that is full width on mobile, 750px on tablet (768px+),
   and 960px on desktop (1024px+), centered with margin auto
2. Inside: a .grid with 1 column on mobile, 2 columns on tablet, 
   3 columns on desktop
3. 3 card divs inside the grid with some content
4. Include the viewport meta tag in head`,
    expectedOutput: `A layout that changes columns based on screen size`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Design</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: sans-serif; background: #f5f5f5; padding: 20px; }
      /* Add your responsive styles here */

    </style>
  </head>
  <body>
    <div class="container">
      <div class="grid">
        <div class="card"><h3>Card 1</h3><p>Content here.</p></div>
        <div class="card"><h3>Card 2</h3><p>Content here.</p></div>
        <div class="card"><h3>Card 3</h3><p>Content here.</p></div>
      </div>
    </div>
  </body>
</html>`,
  },
  {
    levelNum: 5,
    index: 1,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `Responsive Navigation — a key pattern in web design.

Mobile hamburger menu pattern:
- On mobile: hide nav links, show a ☰ hamburger button
- On desktop: show nav links, hide hamburger button

Using CSS to show/hide:
.nav-links { display: none; }       /* hidden on mobile */
.hamburger { display: block; }      /* shown on mobile */

@media (min-width: 768px) {
  .nav-links { display: flex; }     /* shown on desktop */
  .hamburger { display: none; }     /* hidden on desktop */
}

Toggle with JavaScript:
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

.nav-links.open { display: flex; flex-direction: column; }`,
    instructions: `Build a responsive navbar:
1. A nav with a logo on the left and links on the right
2. On desktop (768px+): links show horizontally, hamburger hidden
3. On mobile: links hidden, hamburger button (☰) shown
4. Clicking hamburger toggles the links visible/hidden using JavaScript
5. Style the mobile menu to drop down below the navbar`,
    expectedOutput: `A navbar that collapses into a hamburger menu on mobile`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Nav</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: sans-serif; }
      /* Style your responsive navbar here */

    </style>
  </head>
  <body>
    <nav class="navbar">
      <div class="logo">CodeQuest</div>
      <button class="hamburger">☰</button>
      <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Courses</a></li>
        <li><a href="#">Community</a></li>
      </ul>
    </nav>
    <script>
      /* Add your toggle logic here */
    </script>
  </body>
</html>`,
  },
  {
    levelNum: 5,
    index: 2,
    language: 'html',
    exerciseType: 'coding',
    theoryContent: `Final Project — Build a complete responsive webpage.

Putting it all together:
- Semantic HTML structure
- CSS variables for theming
- Flexbox and Grid for layout
- Transitions and hover effects
- Responsive with media queries
- Clean typography

A professional webpage typically has:
1. Navbar — logo + navigation links
2. Hero section — big headline + CTA button
3. Features section — grid of feature cards
4. Footer — links + copyright

CSS reset to start clean:
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

Pro tips:
- Use rem units for font sizes (1rem = 16px)
- Use max-width on containers to limit width on wide screens
- Always test on mobile screen sizes
- Keep color palette consistent (use CSS variables)`,
    instructions: `Build a complete one-page website for a fictional product:
1. Navbar with logo and 3 nav links
2. Hero section: big headline, subtitle, two buttons (primary + outlined)
3. Features section: heading + 3 feature cards in a grid
4. Footer with copyright text
5. Must be fully responsive (mobile + desktop)
6. Use CSS variables for your color theme
7. Add hover transitions on buttons and cards`,
    expectedOutput: `A complete, styled, responsive one-page website`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Product Page</title>
    <style>
      :root {
        --primary: #6c63ff;
        --dark: #0d1117;
        --text: #333;
        --light: #f8f9fa;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', sans-serif; color: var(--text); }
      /* Build your complete page styles here */

    </style>
  </head>
  <body>
    <!-- Navbar -->
    <nav></nav>

    <!-- Hero -->
    <section class="hero"></section>

    <!-- Features -->
    <section class="features"></section>

    <!-- Footer -->
    <footer></footer>
  </body>
</html>`,
  },
];

async function seedHTMLTheory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the HTML course
    const htmlCourse = await Course.findOne({
      title: { $regex: /html/i }
    });

    if (!htmlCourse) {
      console.log('HTML course not found in database.');
      console.log('Make sure you ran the original seed.js first.');
      process.exit(1);
    }

    console.log(`Found HTML course: ${htmlCourse.title} (${htmlCourse._id})`);

    let updatedCount = 0;

    for (const data of htmlTheoryData) {
      const challengesInLevel = await Challenge.find({
        courseId: htmlCourse._id,
        levelNum: data.levelNum,
      }).sort({ createdAt: 1, _id: 1 });

      if (!challengesInLevel[data.index]) {
        console.log(`No challenge at level ${data.levelNum} index ${data.index} — skipping`);
        continue;
      }

      const challenge = challengesInLevel[data.index];

      await Challenge.findByIdAndUpdate(challenge._id, {
        $set: {
          language: data.language,
          exerciseType: data.exerciseType,
          theoryContent: data.theoryContent,
          instructions: data.instructions,
          expectedOutput: data.expectedOutput,
          starterCode: data.starterCode || challenge.starterCode,
        }
      });

      console.log(`Updated: Level ${data.levelNum} - ${challenge.title}`);
      updatedCount++;
    }

    console.log(`\nDone! Updated ${updatedCount} HTML challenges with theory content.`);
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedHTMLTheory();
