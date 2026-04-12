# Hero-to-Nav Transformation Instructions

## 1. Hero Section Initial Layout

- Full-screen hero section resembling an AI chat interface.
- Centered input field or message area.
- Prominent heading (e.g., "Talk to Your AI Partner").
- Ensure this section fills the viewport and remains fixed until scroll.

## 2. Scroll Trigger

- Detect the user scrolling down from the hero section.
- On first scroll, initiate transformation.

## 3. Transition Animation

- Add a slight delay (~100ms) after scroll starts.
- Animate the hero section shrinking or sliding upward into a compact navigation bar.
- Ensure the animation is smooth—perhaps a “clunky” effect, then a clean snap into place.

## 4. Navigation Bar State

- After the animation, the hero content condenses into a top nav bar.
- The navigation bar should now persist at the top as the user continues to scroll.

## 5. Component Separation

- Break the hero section into a standalone component (e.g., HeroComponent).
- Break the navigation bar into a separate component (e.g., NavBarComponent).
- Implement a shared state or event listener to handle the scroll-triggered transition between them.
