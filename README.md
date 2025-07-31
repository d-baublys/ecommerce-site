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
- **Database:** PostgreSQL
- **Hosting:** Vercel

## Lessons
- Extend existing React knowledge into client/server component distinction
- Working with and around component hydration
- Using Prisma to abstract database interactions
- Building Prisma schema to mirror frontend data structures
- Building interactive elements with complex logic, such as zoomable images
- Using Jest and Cypress for extensive unit and end-to-end test coverage
- How to assure the app is accessible through manual and automated means
- Using local PostgreSQL databases for development and test data

## Demonstrates
- Accommodating both desktop and mobile devices and various screen sizes
- Attention to detail in creating an accessible shopping experience
- Consideration about overall user experience and interaction edge cases
- Consistent iteration for organisation and maintaining DRY principles
- Ability to integrate 3rd-party solutions (Stripe)

