## Plan ✅

1. video page ✅
2. create or join page ✅
3. dynamic create or join page
4. create a room for other to enter into video call
5. improve UI of all existing UI
6. Add AI feature like tracking eye ball and face recognition
7. AI to record movement and analyze it

<!-- ===== Know More About Project -->

<!-- ------------- #### ---------- -->

## Store

### store component is defined using under score.

like "user_details.tsx"

## Project Overview

A Next.js app that uses Stream Video to create and join real-time video calls, with a lightweight setup UI and API routes to generate Stream tokens.

## Tech Stack

- Next.js 16.2.1 (App Router)
- React 19.2.4
- Stream Video React SDK and Stream Chat
- Zustand for client state (store files under `app/stores`)
- Tailwind CSS v4 with PostCSS

## Scripts (package.json)

- `npm run dev` - start the dev server
- `npm run build` - production build
- `npm run start` - run the production server
- `npm run lint` - lint the codebase

## Environment Variables

- `NEXT_PUBLIC_API_KEY` - Stream API key used by the client
- `STREAM_SECRET` - Stream secret used by the token API route

## Routes

- `/` - placeholder landing page (`app/page.tsx`)
- `/setup-call` - create/join UI (`app/(page)/setup-call/page.tsx`)
- `/video` - Stream Video call UI (`app/(page)/video/page.tsx`)

## API Routes

- `POST /api/token` - returns a Stream user token from `userId`
- `POST /api/userDetails` - placeholder for user detail handling (not implemented yet)

## Styling

- Global styles are in `app/globals.css`.
- Third-party styles are imported in `app/layout.tsx` for Stream Chat and Stream Video.

## Structure

- `app/(page)/setup-call/page.tsx` - setup call UI
- `app/(page)/video/page.tsx` - Stream Video call screen
- `app/api/token/route.tsx` - Stream token generator
- `app/api/userDetails/route.tsx` - user detail endpoint placeholder
- `app/stores/*` - Zustand stores (underscore file naming)



<!-- helping DOC -->

#### zustand

- https://zustand.docs.pmnd.rs/learn/guides/nextjs
