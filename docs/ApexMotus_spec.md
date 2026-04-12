# ApexMotus Landing Page Restructuring Spec

## Tech Stack

- Framework: Next.js (for server-side rendering and SEO)
- Styling: Tailwind CSS
- Hosting: Vercel
- Email: Resend
- OpenAI API: Integrated for interactive prompt

## Hero Section

1. Initial Prompt:
   - Display a conversational prompt: "Give me 5 facts about your business, and I'll give you 5 potential problems. If none are accurate, I owe you a cup of coffee."
   - User inputs 5 facts about their business.
   - Upon submission, send facts to the OpenAI API.
   - Display the generated problems dynamically (like a chat response).

2. Result Interaction:
   - Replace input with buttons: "How many were accurate?" (0, 1, 2, 3, 4, 5).

3. Zero Selected:
   - Transform hero into a form.
   - Form fields: First Name, Last Name, Company, Email, Phone Number.
   - Message: "Let’s meet and chat over a cup of coffee."

4. 1–5 Selected:
   - Same form fields appear.
   - Message: "Let’s meet and chat about a tailored solution for you."

## About Us Section

- Minimal text: Who we are, what we do, brief and clear.

## Product Showcase Section

- Display a gallery or list of existing products.
- Each product links to its hosted landing page.
- You will provide product URLs to populate this section.

## Contact Section

- Standard contact form or details.
- Align styling with existing brand colors, logos, and theme.

## Environment & Deployment

- Hosting on Vercel.
- Resend for email handling.
- Environment variables (API keys, etc.) to be configured securely at deployment phase.
