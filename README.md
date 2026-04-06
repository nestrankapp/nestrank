
NestRank
NestRank is a serverless neighborhood scoring app built for Vercel. It analyzes an address, scores it across flyer-inspired categories, generates nearby candidate areas, and now includes actual Auth.js wiring for Google sign-in and saved searches.

Brand
Chosen product name: NestRank

Why it works:

short and memorable,

clearly implies ranking,

flexible for consumer or pro versions,

easy to extend into saved reports, alerts, and premium search tools.

Stack
Next.js App Router

Vercel Functions

Auth.js with Google provider

Geocode.maps.co for address geocoding

Overpass API for nearby POI data

US Census Geocoder for geographic enrichment

Auth wiring included
This version includes:

auth.js Auth.js config,

/api/auth/[...nextauth] route,

Google sign-in button,

authenticated saved-search API routes,

session provider for the app.

Important note on saved searches
Saved searches currently use an in-memory mock store so the app can run immediately. For real public launch, replace that with Vercel Postgres, Neon, Supabase, or another durable database.

Environment variables
Create .env.local from .env.example and set:

bash
MAPSCO_API_KEY=YOUR_MAPSCO_KEY
AUTH_SECRET=replace-with-a-long-random-secret
AUTH_GOOGLE_ID=replace-with-google-client-id
AUTH_GOOGLE_SECRET=replace-with-google-client-secret
AUTH_URL=http://localhost:3000
On Vercel, add the same values in Project Settings > Environment Variables. Auth.js requires AUTH_SECRET, and Vercel supports environment variables through project settings.

Google OAuth setup
Create an OAuth client in Google Cloud.

Add the callback URL:

http://localhost:3000/api/auth/callback/google

https://your-domain.com/api/auth/callback/google

Paste client ID and secret into your environment variables.

Run locally
bash
npm install
npm run dev
Deploy to Vercel
Push to GitHub.

Import the repository into Vercel.

Add all environment variables.

Deploy.

Test sign-in, saved searches, and address analysis.

Next production upgrades
Move saved searches to Postgres.

Add Redis or KV caching for analysis responses.

Add Vercel WAF rate limiting for /api/analyze.

Add map UI and shareable reports.
