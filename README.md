# Synsorempire

Online store for Synsorempire, a fashion shop in Ibadan, Ogunpa. Customers browse corporate wear, formal shoes, sneakers, streetwear, caps, belts, bags and essentials, then order on WhatsApp. The owner manages every product from a private admin area.

## What it does

* **Storefront.** Home page, product cards, a detail page for every item with a photo gallery, price, sizes, description and availability.
* **Product codes.** Every product gets a short unique code such as SYN0007. The code is shown on the site and written into every WhatsApp order message, together with the product name and a link, so the owner always knows which item a customer means.
* **WhatsApp ordering.** Tapping Order opens WhatsApp with the message already written. The customer taps send.
* **Payment policy.** Payment is required before delivery. This is stated on the home page, every product page and the footer. Cash on delivery is never offered.
* **No invented prices.** If a product has no price, the site shows Message for price.
* **Admin area** at `/admin`: dashboard counts, add product with photos, edit product, feature on the home page, hide or show, delete. Photos are compressed in the browser before upload.
* **Search visibility.** Sitemap, robots file, canonical links, share preview image and a custom 404 page. Admin pages are hidden from search engines.

## How it works

```
Visitor's browser
      =>  Next.js app on Vercel
              =>  Supabase (database and admin login)
              =>  Cloudinary (product photos)
```

* Public pages read products straight from the database and are cached for five minutes. When the admin saves a change, the affected pages refresh at once.
* The admin area runs on the server. Every action checks that the person is a logged in admin before it touches any data.
* Photos upload from the browser directly to Cloudinary using a short lived signature created by the server. The database stores only the photo reference.

## Tech stack

* Next.js 16 (App Router) and React 19
* Tailwind CSS 4 for the base layer, with hand written styles for the brand
* Supabase: Postgres database, authentication, row level security
* Cloudinary: photo storage and delivery, resized for each screen
* Vercel: hosting
* GitHub Actions: type check on every push, and a twice weekly ping that keeps the free database awake

## Security

* Row level security is on for every table. The public can only read visible products, categories and photos. Only admins can write.
* The admin check happens on the server for every action, not only in the page layout.
* The Cloudinary secret and all server keys exist only in server side code and environment variables. Nothing secret reaches the browser.
* Uploads need a signature that only a logged in admin can request.
* Public signups are turned off in Supabase. New admins are added by hand.
* Security headers are set in `next.config.ts`.
* No customer data is collected by the site. Orders happen inside WhatsApp.

## Project structure

```
app/                  pages, admin area, sitemap, robots, error pages
components/           storefront and admin components
lib/                  site settings, image links, Supabase and Cloudinary helpers
scripts/              keep alive script used by GitHub Actions
supabase/schema.sql   the full database setup
.github/workflows/    CI and keep alive jobs
proxy.ts              keeps the admin login session fresh
```

Business details such as the WhatsApp number, email, location and category descriptions live in `lib/site.ts`.

## Run it locally

1. Install dependencies:

```
npm install
```

2. Copy the example settings and fill them in:

```
cp .env.example .env.local
```

3. Create a Supabase project, open the SQL Editor, and run `supabase/schema.sql`.
4. In Supabase Authentication, turn off public signups and create the admin accounts. Then run the commented `insert into admins` line at the bottom of the schema file with each account's user ID.
5. Start the site:

```
npm run dev
```

The site opens at `http://localhost:3000` and the admin at `http://localhost:3000/admin`.

## Environment variables

* `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: from Supabase, Project Settings, API.
* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: from the Cloudinary dashboard.
* `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`: from the Cloudinary dashboard. Server only, never prefix these with `NEXT_PUBLIC_`.
* `NEXT_PUBLIC_SITE_URL`: the live address with no trailing slash. Needed for WhatsApp product links, the sitemap and share previews.
* `NEXT_PUBLIC_GOOGLE_VERIFICATION`: optional, the Google Search Console token.

## Deploy

1. Push to GitHub and import the repository in Vercel.
2. Add every environment variable above in Vercel, Settings, Environment Variables.
3. Every push to `main` deploys automatically. A failed build never replaces the live site.
4. In GitHub, Settings, Secrets and variables, Actions, add `SUPABASE_URL` and `SUPABASE_ANON_KEY`. The keep alive job uses them.

## Search Console

1. Add the live address as a property in Google Search Console using the HTML tag method.
2. Put the token in `NEXT_PUBLIC_GOOGLE_VERIFICATION`, redeploy, then verify.
3. Submit `sitemap.xml` and request indexing for the home page.

## Owner guide

* **Add a product:** log in at `/admin`, choose Add product, fill the form and add up to 8 photos. The first photo is the main one.
* **Product codes** are created automatically. Customers can quote the code, and the Products list shows it beside every name.
* **Feature:** a featured product's photo appears in the home page banner.
* **Hide** removes a product from the site without deleting it. **Delete** removes it and its photos for good.
* **Prices:** leave the price empty to show Message for price.

## Plans and limits

The project runs on free plans today. Supabase pauses a free database after a week without activity, which is why the keep alive job exists. Review each provider's terms and move to a paid plan as traffic and commercial use grow.

## Planned next

* Add, remove and reorder photos on an existing product
* Order log in the admin area, with rate limiting
* Weekly product backup
* Privacy page when any visitor data starts being collected

Built by JoeBuildsThings for Synsorempire, Ibadan. All rights reserved.
