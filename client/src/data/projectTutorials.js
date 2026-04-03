const PROJECT_TUTORIALS = [
  {
    id: 'portfolio-website',
    title: 'Personal Portfolio Website',
    author: 'CodeQuest Tutorials',
    description: 'Build a polished responsive portfolio with smooth animations, a dark mode toggle, and a downloadable final project.',
    language: 'html',
    difficulty: 'Beginner',
    totalXp: 90,
    duration: '75 min',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    steps: [
      {
        index: 0,
        title: 'Navbar',
        xp: 15,
        theory: `This step builds the top navigation bar that anchors the whole portfolio. Implementation focus: wrap the brand and menu in a semantic nav element, use flexbox to place the logo on one side and the links on the other, and keep the bar fixed so the menu stays visible while scrolling. Demo code walkthrough: line 1 opens the nav wrapper, line 2 adds the brand name block, lines 3 to 8 build the unordered list of page links, and line 9 closes the navigation. The syntax shown above uses display:flex, justify-content: space-between, and align-items:center to keep the layout clean and balanced.`,
        instructions: 'Add a fixed navbar with logo and links.',
        syntax: 'nav { display: flex; justify-content: space-between; align-items: center; }',
        hint: 'Use nav and flexbox.',
        validation: ['nav-logo', 'nav-links', 'backdrop-filter'],
        expectedOutput: 'Navbar complete.',
        starterCode: `<nav class="nav">
  <div class="nav-logo">Alex Dev</div>
  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>`,
        solutionCode: `<nav class="nav">
  <div class="nav-logo">Alex Dev</div>
  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>`,
      },
      {
        index: 1,
        title: 'Hero',
        xp: 15,
        theory: `This step creates the first screen the visitor sees, so the goal is a strong headline and clear calls to action. Implementation focus: center the hero content with flexbox, keep the copy short and direct, and place two action links inside a button group so the user can jump to projects or contact details. Demo code walkthrough: line 1 opens the hero section, line 2 prints the heading with the highlighted name span, line 3 begins the CTA wrapper, lines 4 and 5 add the two links, line 6 closes the button group, and line 7 closes the section. The syntax above uses min-height: 100vh plus flex alignment to keep the content vertically centered.`,
        instructions: 'Add a bold hero section.',
        syntax: '.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }',
        hint: 'Keep the hero centered.',
        validation: ['hero', 'btn-group', 'gradient-text'],
        expectedOutput: 'Hero section complete.',
        starterCode: `<section class="hero">
  <h1>Hi, I'm <span class="gradient-text">Alex Dev</span></h1>
  <div class="btn-group">
    <a href="#projects">View Projects</a>
    <a href="#contact">Download CV</a>
  </div>
</section>`,
        solutionCode: `<section class="hero">
  <h1>Hi, I'm <span class="gradient-text">Alex Dev</span></h1>
  <div class="btn-group">
    <a href="#projects">View Projects</a>
    <a href="#contact">Download CV</a>
  </div>
</section>`,
      },
      {
        index: 2,
        title: 'About',
        xp: 15,
        theory: `This step adds a personal introduction and visual proof of skill, which helps build trust quickly. Implementation focus: create a two-column grid, place the avatar or initials on one side, write a concise biography on the other, and use a skill fill element to show confidence in a technology or tool. Demo code walkthrough: line 1 opens the about section, line 2 starts the grid container, line 3 renders the avatar block, line 4 opens the content panel, line 5 adds the heading, line 6 inserts the skill bar, line 7 closes the content area, line 8 closes the grid, and line 9 closes the section. The syntax demonstrates CSS Grid with unequal column widths so the bio feels more spacious than the avatar block.`,
        instructions: 'Create the about section.',
        syntax: '.about-container { display: grid; grid-template-columns: 1fr 1.5fr; gap: 48px; }',
        hint: 'Use grid and skill bars.',
        validation: ['about-container', 'skill-fill'],
        expectedOutput: 'About section complete.',
        starterCode: `<section id="about" class="about">
  <div class="about-container">
    <div class="about-avatar">AD</div>
    <div class="about-content">
      <h2>About Me</h2>
    </div>
  </div>
</section>`,
        solutionCode: `<section id="about" class="about">
  <div class="about-container">
    <div class="about-avatar">AD</div>
    <div class="about-content">
      <h2>About Me</h2>
      <div class="skill-fill" style="width:80%"></div>
    </div>
  </div>
</section>`,
      },
      {
        index: 3,
        title: 'Projects',
        xp: 15,
        theory: `This step is where the portfolio proves value by showing actual work in a structured card layout. Implementation focus: use a responsive grid so cards wrap naturally, make each card readable at multiple screen sizes, and include project names or tags that make the work easy to scan. Demo code walkthrough: line 1 opens the projects section, line 2 starts the grid container, line 3 creates the first project card, lines 4 and 5 add the remaining cards, and line 6 closes the section. The syntax shown above uses repeat(auto-fit, minmax(...)) so the grid adapts automatically as the screen gets wider or narrower.`,
        instructions: 'Add three project cards.',
        syntax: '.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }',
        hint: 'Use project cards and tags.',
        validation: ['projects-grid', 'project-card', 'Live Demo'],
        expectedOutput: 'Projects section complete.',
        starterCode: `<section id="projects" class="projects-grid">
  <article class="project-card">Weather App</article>
</section>`,
        solutionCode: `<section id="projects" class="projects-grid">
  <article class="project-card">Weather App</article>
  <article class="project-card">Task Manager</article>
  <article class="project-card">AI Chat Bot</article>
</section>`,
      },
      {
        index: 4,
        title: 'Contact',
        xp: 15,
        theory: `This step gives visitors a direct way to reach out, so the layout should feel simple and usable. Implementation focus: create a form wrapper, collect a name field first, then add the button or social links so the user has a clear next action, and prepare the form for later JavaScript handling. Demo code walkthrough: line 1 opens the contact section, line 2 starts the form, line 3 adds the text input, line 4 closes the form in the starter version, and the completed version adds the submit button before the closing form tag. The syntax line shows submit-event handling with preventDefault so the page can show custom feedback instead of reloading.`,
        instructions: 'Add the contact form.',
        syntax: `form.addEventListener('submit', (event) => event.preventDefault());`,
        hint: 'Show a success message.',
        validation: ['contact-form', 'success-msg', 'handleSubmit'],
        expectedOutput: 'Contact section complete.',
        starterCode: `<section id="contact" class="contact-form">
  <form>
    <input type="text" placeholder="Your name">
  </form>
</section>`,
        solutionCode: `<section id="contact" class="contact-form">
  <form>
    <input type="text" placeholder="Your name">
    <button>Send Message</button>
  </form>
</section>`,
      },
      {
        index: 5,
        title: 'Dark Mode + Footer',
        xp: 15,
        theory: `This step finishes the portfolio with polish and practical usability details. Implementation focus: add a theme toggle so the page can switch appearance, keep the footer small but useful, and store the selected theme so the experience feels persistent. Demo code walkthrough: line 1 creates the theme button, line 2 adds the footer container, and the finished version would connect the toggle button to JavaScript that changes body classes and saves the preference. The syntax example shows the classList toggle pattern, which is the core operation behind a light and dark mode switch.`,
        instructions: 'Add dark mode and back to top.',
        syntax: `document.body.classList.toggle('light-mode');`,
        hint: 'Persist theme in localStorage.',
        validation: ['toggleTheme()', 'scrollToTop()', 'portfolio-theme'],
        expectedOutput: 'Portfolio finished.',
        starterCode: `<button class="theme-toggle">🌙</button><footer class="footer"></footer>`,
        solutionCode: `<button class="theme-toggle">🌙</button><footer class="footer"></footer>`,
      },
    ],
  },
  {
    id: 'restaurant-landing-page',
    title: 'Restaurant Landing Page',
    author: 'CodeQuest Tutorials',
    description: 'Build a modern restaurant landing page with a polished hero, featured dishes, reservations, and a stylish footer.',
    language: 'html',
    difficulty: 'Beginner',
    totalXp: 60,
    duration: '45 min',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: '🍽️',
    gradient: 'linear-gradient(135deg, #f6d365, #fda085)',
    steps: [
      { index: 0, title: 'Hero Navbar', xp: 15, theory: `This step sets the tone for the restaurant site by combining navigation with a warm opening hero. Implementation focus: place the restaurant name and menu links in a top bar, keep the header visually welcoming, and make the first action clear so visitors can jump to the menu or reservation area. Demo code walkthrough: line 1 creates the nav wrapper for the header area, and line 2 creates the hero section shell that will hold the opening message. The syntax note is simple here because the main layout goal is a full-height hero block that can later be styled with spacing, colors, and alignment.`, instructions: 'Add hero and nav.', syntax: '.hero { min-height: 100vh; }', hint: 'Use a warm layout.', validation: ['restaurant-nav', 'hero-cta'], expectedOutput: 'Hero section ready.', starterCode: `<nav class="restaurant-nav"></nav><section class="hero"></section>`, solutionCode: `<nav class="restaurant-nav"></nav><section class="hero"></section>` },
      { index: 1, title: 'Featured Menu', xp: 15, theory: `This step presents the dishes in a clean grid so the menu is easy to scan. Implementation focus: create a repeated card layout, keep each food item visually balanced, and make sure the grid can expand or collapse naturally as the screen size changes. Demo code walkthrough: line 1 opens the menu section, line 2 applies the menu-grid class, and the completed version would place individual dish cards inside that wrapper. The syntax uses CSS Grid because it gives you predictable spacing, equal columns, and a responsive layout with very little code.`, instructions: 'Build a menu grid.', syntax: '.menu-grid { display: grid; }', hint: 'Add dish cards.', validation: ['menu-grid', 'dish-card'], expectedOutput: 'Menu section ready.', starterCode: `<section id="menu" class="menu-grid"></section>`, solutionCode: `<section id="menu" class="menu-grid"></section>` },
      { index: 2, title: 'Chef Story', xp: 15, theory: `This step adds trust by telling a short story about the chef or restaurant. Implementation focus: split the content into two parts, one visual and one text-based, then use the story copy to explain why the restaurant is unique and credible. Demo code walkthrough: line 1 opens the story section container, and the finished version would place the image or illustration alongside the text inside that grid. The syntax shows a grid layout because a two-column structure gives the story enough breathing room without feeling cramped.`, instructions: 'Create a split story section.', syntax: '.story-grid { display: grid; }', hint: 'Use a two-column layout.', validation: ['story-grid', 'chef-note'], expectedOutput: 'Story section ready.', starterCode: `<section class="story-grid"></section>`, solutionCode: `<section class="story-grid"></section>` },
      { index: 3, title: 'Reservations + Footer', xp: 15, theory: `This step finishes the restaurant page with a conversion point and a clean closing area. Implementation focus: add a reservation form, keep the interaction simple, and place the footer beneath it so visitors can find contact details or extra links after reading the page. Demo code walkthrough: line 1 opens the reserve section, and the completed version would add the form fields and footer content inside that wrapper. The syntax line shows form submission handling with preventDefault, which lets the page show a custom reservation confirmation instead of refreshing.`, instructions: 'Add the form and footer.', syntax: `form.addEventListener('submit', (event) => event.preventDefault());`, hint: 'Show a confirmation message.', validation: ['reservation-form', 'confirmMessage'], expectedOutput: 'Restaurant site finished.', starterCode: `<section id="reserve"></section>`, solutionCode: `<section id="reserve"></section>` },
    ],
  },
  {
    id: 'travel-blog-homepage',
    title: 'Travel Blog Homepage',
    author: 'CodeQuest Tutorials',
    description: 'Create a warm travel blog homepage with a striking hero, destination cards, a feature story, and a newsletter footer.',
    language: 'html',
    difficulty: 'Beginner',
    totalXp: 60,
    duration: '45 min',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: '🌍',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    steps: [
      { index: 0, title: 'Hero Header', xp: 15, theory: `This step creates a bright first impression with a travel-style hero and navigation. Implementation focus: open with a simple nav bar, place the destination name or brand in the header, and let the hero area feel like a postcard so the page immediately suggests movement and discovery. Demo code walkthrough: line 1 creates the travel navigation header shell, and the finished version would place the brand text and hero copy inside that same section. The syntax points to a full-height hero because travel pages usually need a large, welcoming opening panel.`, instructions: 'Add a nav and hero.', syntax: '.travel-hero { min-height: 100vh; }', hint: 'Use postcard styling.', validation: ['travel-nav', 'travel-hero'], expectedOutput: 'Travel hero ready.', starterCode: `<header class="travel-nav"></header>`, solutionCode: `<header class="travel-nav"></header>` },
      { index: 1, title: 'Destinations', xp: 15, theory: `This step turns the page into a gallery of places people might want to visit. Implementation focus: build a grid of destination cards, keep the spacing even, and use image or text blocks that make each destination feel like a short postcard entry. Demo code walkthrough: line 1 opens the destinations section, line 2 applies the travel-grid class, and the completed version would fill that wrapper with the destination cards. The syntax uses CSS Grid so the cards stay aligned and responsive without extra layout code.`, instructions: 'Build destination cards.', syntax: '.travel-grid { display: grid; }', hint: 'Use postcard cards.', validation: ['travel-grid', 'destination-card'], expectedOutput: 'Destinations ready.', starterCode: `<section id="destinations" class="travel-grid"></section>`, solutionCode: `<section id="destinations" class="travel-grid"></section>` },
      { index: 2, title: 'Feature Story', xp: 15, theory: `This step adds a narrative block that explains one trip in a little more detail. Implementation focus: split the section into a visual side and a text side, then use the story to guide the reader from curiosity to the next call to action. Demo code walkthrough: line 1 opens the feature story section, and the full version would place a photo panel and the written story inside that wrapper. The syntax note shows a grid because the two-column structure is what keeps the section readable and structured.`, instructions: 'Create a split feature story.', syntax: '.feature-story { display: grid; }', hint: 'Use a visual panel and text.', validation: ['feature-story', 'read-more'], expectedOutput: 'Feature story ready.', starterCode: `<section id="story" class="feature-story"></section>`, solutionCode: `<section id="story" class="feature-story"></section>` },
      { index: 3, title: 'Newsletter Footer', xp: 15, theory: `This step gives the travel blog a final engagement point and a tidy ending. Implementation focus: add a newsletter form, keep the interaction short and friendly, and include footer links so readers can follow more content or return later. Demo code walkthrough: line 1 opens the newsletter section, and the finished version would place the email field, submit button, and footer links inside it. The syntax line shows submit handling with preventDefault, which is the same pattern used when you want the page to react without reloading.`, instructions: 'Add subscription and footer links.', syntax: `newsletterForm.addEventListener('submit', (event) => event.preventDefault());`, hint: 'Show a confirmation message.', validation: ['newsletter-form', 'footer-links'], expectedOutput: 'Travel blog finished.', starterCode: `<section id="newsletter"></section>`, solutionCode: `<section id="newsletter"></section>` },
    ],
  },
  {
    id: 'photography-showcase',
    title: 'Photography Showcase',
    author: 'CodeQuest Tutorials',
    description: 'Build a clean photography showcase with a dramatic hero, gallery grid, about panel, and contact footer.',
    language: 'html',
    difficulty: 'Beginner',
    totalXp: 60,
    duration: '45 min',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: '📷',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    steps: [
      { index: 0, title: 'Hero Intro', xp: 15, theory: `This step sets the mood for the photography site with large typography and a focused opening message. Implementation focus: lead with one strong line about the photographer or style, keep the call to action visible, and make the hero area feel spacious enough for dramatic visuals. Demo code walkthrough: line 1 opens the hero section shell, and the completed version would place the headline and CTA inside it. The syntax keeps the hero full height so the opening screen feels intentional and cinematic.`, instructions: 'Add a hero and one CTA.', syntax: '.photo-hero { min-height: 100vh; }', hint: 'Focus on typography.', validation: ['photo-hero', 'book-session'], expectedOutput: 'Hero ready.', starterCode: `<section class="photo-hero"></section>`, solutionCode: `<section class="photo-hero"></section>` },
      { index: 1, title: 'Gallery Grid', xp: 15, theory: `This step arranges the work into a curated gallery that is easy to browse. Implementation focus: create equal photo tiles, keep spacing consistent, and let the layout adapt across screen sizes so the gallery stays polished on mobile and desktop. Demo code walkthrough: line 1 opens the gallery section, line 2 applies the gallery-grid class, and the completed version would insert the photo cards inside that wrapper. The syntax uses CSS Grid because it is the cleanest way to keep image cards lined up.`, instructions: 'Build an image gallery.', syntax: '.gallery-grid { display: grid; }', hint: 'Keep image tiles equal.', validation: ['gallery-grid', 'photo-card'], expectedOutput: 'Gallery ready.', starterCode: `<section id="gallery" class="gallery-grid"></section>`, solutionCode: `<section id="gallery" class="gallery-grid"></section>` },
      { index: 2, title: 'About The Artist', xp: 15, theory: `This step adds context so visitors understand the person behind the photos. Implementation focus: write a short bio, list specialties or styles, and arrange the content next to a portrait or camera-related visual so the section feels personal. Demo code walkthrough: line 1 opens the bio section, and the finished version would place the portrait and text in the two-column layout inside it. The syntax line shows a grid because that is what gives the artist description enough structure without looking cramped.`, instructions: 'Create a split bio section.', syntax: '.bio-grid { display: grid; }', hint: 'Use a portrait block.', validation: ['bio-grid', 'camera-list'], expectedOutput: 'About section ready.', starterCode: `<section class="bio-grid"></section>`, solutionCode: `<section class="bio-grid"></section>` },
      { index: 3, title: 'Contact Footer', xp: 15, theory: `This step closes the site with a simple way to book or get in touch. Implementation focus: add a contact form, keep the fields minimal, and use the footer area for social links or a back-to-top action so the page ends with a useful next step. Demo code walkthrough: line 1 opens the contact section, and the full version would place the form and footer content inside it. The syntax shows a submit handler because the contact form should respond without leaving the page.`, instructions: 'Add contact and social links.', syntax: `function handleContact(event) { event.preventDefault(); }`, hint: 'Show success on submit.', validation: ['contact-form', 'backToTop'], expectedOutput: 'Photography site finished.', starterCode: `<section id="contact"></section>`, solutionCode: `<section id="contact"></section>` },
    ],
  },
  {
    id: 'event-landing-page',
    title: 'Event Landing Page',
    author: 'CodeQuest Tutorials',
    description: 'Create an event landing page with a countdown hero, speaker schedule, ticket callouts, and a helpful FAQ section.',
    language: 'html',
    difficulty: 'Beginner',
    totalXp: 60,
    duration: '45 min',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: '🎟️',
    gradient: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
    steps: [
      { index: 0, title: 'Countdown Hero', xp: 15, theory: `This step uses urgency and clarity to get people interested in the event immediately. Implementation focus: build a hero section with the event name, date, and a clear register button, then leave enough space for a countdown or accent area so the opening feels energetic. Demo code walkthrough: line 1 opens the event hero container, and the completed version would place the date, countdown, and call to action inside it. The syntax shows a full-height hero so the first screen can carry the event messaging properly.`, instructions: 'Add a hero and register CTA.', syntax: '.event-hero { min-height: 100vh; }', hint: 'Show date and countdown.', validation: ['event-hero', 'event-cta'], expectedOutput: 'Event hero ready.', starterCode: `<section class="event-hero"></section>`, solutionCode: `<section class="event-hero"></section>` },
      { index: 1, title: 'Schedule', xp: 15, theory: `This step explains the event flow so visitors know what to expect. Implementation focus: lay out sessions as a timeline, pair each time slot with a speaker card, and keep the information easy to scan in order. Demo code walkthrough: line 1 opens the timeline section, and the finished version would place each session card inside that timeline wrapper. The syntax uses a grid layout because it keeps the schedule aligned and readable without complex positioning.`, instructions: 'Add speaker cards.', syntax: '.timeline { display: grid; }', hint: 'Use time labels.', validation: ['timeline', 'speaker-card'], expectedOutput: 'Schedule ready.', starterCode: `<section class="timeline"></section>`, solutionCode: `<section class="timeline"></section>` },
      { index: 2, title: 'Tickets', xp: 15, theory: `This step compares attendance options so people can choose the right ticket quickly. Implementation focus: create a small pricing or ticket card set, highlight the best value option, and keep each plan short enough to compare at a glance. Demo code walkthrough: line 1 opens the tickets section, line 2 adds the ticket-grid class, and the completed version would place the individual ticket cards inside the wrapper. The syntax again uses CSS Grid because card comparison works best in a neat column layout.`, instructions: 'Create ticket cards.', syntax: '.ticket-grid { display: grid; }', hint: 'Highlight the recommended ticket.', validation: ['ticket-grid', 'buyTickets'], expectedOutput: 'Tickets ready.', starterCode: `<section id="tickets" class="ticket-grid"></section>`, solutionCode: `<section id="tickets" class="ticket-grid"></section>` },
      { index: 3, title: 'FAQ + Footer', xp: 15, theory: `This step closes the event page by answering common questions and ending with support links. Implementation focus: add compact FAQ items, keep the answers direct, and place the footer underneath so visitors can still find help or social links after reading the page. Demo code walkthrough: line 1 opens the FAQ section, and the completed version would include the question cards and footer content inside that same area. The syntax uses a bottom border treatment to keep each FAQ item separated without heavy visuals.`, instructions: 'Add FAQ items and support links.', syntax: '.faq-item { border-bottom: 1px solid rgba(255,255,255,0.08); }', hint: 'Keep it compact.', validation: ['faq-item', 'support-link'], expectedOutput: 'Event page finished.', starterCode: `<section class="faq"></section>`, solutionCode: `<section class="faq"></section>` },
    ],
  },
  {
    id: 'product-launch-page',
    title: 'Product Launch Page',
    author: 'CodeQuest Tutorials',
    description: 'Design a modern product launch page with a compelling hero, feature grid, testimonials, and a pricing footer.',
    language: 'html',
    difficulty: 'Beginner',
    totalXp: 60,
    duration: '45 min',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    steps: [
      { index: 0, title: 'Launch Hero', xp: 15, theory: `This step introduces the product with a direct promise and a strong call to action. Implementation focus: open with a bold hero statement, keep the text focused on the product value, and make the action button obvious so the visitor immediately knows what to do next. Demo code walkthrough: line 1 opens the launch hero section, and the finished version would place the headline, support text, and CTA inside that block. The syntax shows a full-height hero because launch pages work best when the first message fills the viewport.`, instructions: 'Add a strong hero and CTA.', syntax: '.launch-hero { min-height: 100vh; }', hint: 'Use a strong value proposition.', validation: ['launch-hero', 'downloadBtn'], expectedOutput: 'Launch hero ready.', starterCode: `<section class="launch-hero"></section>`, solutionCode: `<section class="launch-hero"></section>` },
      { index: 1, title: 'Features', xp: 15, theory: `This step explains what the product actually does in a compact feature section. Implementation focus: list three or more benefits, keep each card easy to read, and arrange them in a grid so the product message feels organized. Demo code walkthrough: line 1 opens the features section, line 2 applies the feature-grid class, and the completed version would place the feature cards inside that wrapper. The syntax uses CSS Grid because it keeps product benefits aligned and tidy.`, instructions: 'Add three feature cards.', syntax: '.feature-grid { display: grid; }', hint: 'Keep copy concise.', validation: ['feature-grid', 'feature-card'], expectedOutput: 'Features ready.', starterCode: `<section id="features" class="feature-grid"></section>`, solutionCode: `<section id="features" class="feature-grid"></section>` },
      { index: 2, title: 'Testimonials', xp: 15, theory: `This step adds social proof so the product feels trustworthy. Implementation focus: collect short testimonial quotes, keep them believable and specific, and use cards so the text looks structured rather than crowded. Demo code walkthrough: line 1 opens the testimonial section, line 2 applies the testimonial-grid class, and the finished version would add each quote card inside that container. The syntax uses a grid because testimonials work best when they are visually balanced and easy to compare.`, instructions: 'Add quote cards.', syntax: '.testimonial-grid { display: grid; }', hint: 'Make them short and believable.', validation: ['testimonial-grid', 'testimonial-card'], expectedOutput: 'Testimonials ready.', starterCode: `<section class="testimonial-grid"></section>`, solutionCode: `<section class="testimonial-grid"></section>` },
      { index: 3, title: 'Pricing Footer', xp: 15, theory: `This step finishes the product page by turning interest into action. Implementation focus: show pricing or plan cards, keep the call to action direct, and place the footer so the page ends with a confident next step such as starting a trial. Demo code walkthrough: line 1 opens the pricing section, line 2 applies the pricing-grid class, and the completed version would place the plan cards inside that wrapper. The syntax shows a grid because pricing cards are clearer when they sit side by side with even spacing.`, instructions: 'Add pricing cards and footer links.', syntax: '.pricing-grid { display: grid; }', hint: 'End with a decisive action.', validation: ['pricing-grid', 'startTrial'], expectedOutput: 'Product page finished.', starterCode: `<section id="pricing" class="pricing-grid"></section>`, solutionCode: `<section id="pricing" class="pricing-grid"></section>` },
    ],
  },
];

export default PROJECT_TUTORIALS;
