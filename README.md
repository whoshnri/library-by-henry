# library-by-henry

A Next.js + Prisma review library for books, articles, and Substack posts.

## Features

- Public reviews page with clean empty states and review cards
- Review details page with posted date, stars, likes, and comments
- Admin CRM to create, edit, and delete review entries
- Server Actions for creating/updating/deleting reviews, adding comments, and liking reviews

## Local setup

```bash
npm install
npx prisma migrate dev
npm run dev
```
