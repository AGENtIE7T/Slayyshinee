# Slayyshine Jewels — website

Static, dependency-free site (HTML + CSS + JS). Mobile-first, SEO/AEO optimised.

## Deploy on GitHub Pages
1. Create a new GitHub repo and upload **everything in this folder** to the repo root (including the hidden `.github`, `.nojekyll` files).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Push to `main` — the included workflow publishes automatically. URL: `https://USERNAME.github.io/REPO/`.

Also works as-is on Netlify, Vercel or Cloudflare Pages (drag & drop this folder, no build command).

## Before going live
- Find & replace `https://www.slayyshine.com` with your real URL in index.html, shop.html, robots.txt, sitemap.xml, llms.txt.
- Custom domain: add a file named `CNAME` containing just your domain (e.g. `www.slayyshine.com`) and set DNS per GitHub's guide.
- Replace `https://wa.me/` with `https://wa.me/91XXXXXXXXXX`.
- Add real product photos to `images/` and swap the placeholder product images in the JSON-LD.
- Submit `/sitemap.xml` in Google Search Console.

## Files
index.html · shop.html · 404.html · styles.css · main.js · robots.txt · sitemap.xml · llms.txt (AI answer engines) · site.webmanifest · favicon.svg · images/
