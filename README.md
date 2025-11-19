# Next.js E-commerce Site

An e-commerce site stocking fake t-shirts. Used to exercise and build on TypeScript and React knowledge, learn how JavaScript can be used in the backend, and explore the data structures and flows of online shopping.

Live Demo: https://db-wear.vercel.app/

Simulated checkout details:  
**Email**: any fake email  
**Card number**: 4242424242424242  
(see https://docs.stripe.com/testing#cards to obtain card numbers for different outcomes)  
**Expiry date**: any future month  
**CVC**: any 3-digit number  
**Cardholder name**: any fake name  
**Country or region**: any fake postal code  

## Stack
- **Frontend:** Next.js with App Router
- **Backend:** Next.js with API routes
- **Database:** PostgreSQL with Prisma
- **Hosting:** Vercel

## Lessons
- Extend existing React knowledge into client/server component distinction
- Working with and around component hydration
- Using Prisma to abstract database interactions
- Building Prisma schema for e-commerce needs
- Building interactive elements with complex logic, such as zoomable images, for both mouse and touch inputs
- Animating element hovers by manipulating their before/after pseudoelements
- Using Jest for unit testing and exploring edge cases
- Translating manual testing into tangible sequences with Cypress end-to-end testing
- Optimising end-to-end tests and reducing flakiness
- Distinguishing the reponsibilities of unit and end-to-end testing
- Ensuring the app is accessible through manual and automated means
- Using local PostgreSQL databases for development and test data
- Using Auth.js to guard routes and UI with both authentication and authorisation
---
- Refactoring existing logic and type system to use Zod for unified runtime and compile-time validation

## Demonstrates
- Understanding of e-commerce user flows, including purchase, auth, and simple order management
- Attention to detail in creating an accessible experience, such as with tab press focus "trapping" and "restore"
- Create responsive layouts across many routes in a modular fashion
- Ability to build a usable admin suite to visually interface with the database for product and order management
- Visualisation and understanding of edge cases through Jest and Cypress tests
- Consistent iteration for organisation and maintaining DRY principles
- Ability to integrate 3rd-party solutions (Stripe sandbox mode) for illustrative purchases and refunds
---
- Careful consideration about preventing overselling stock whilst keeping the customer informed
