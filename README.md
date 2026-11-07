# The Fullstack Failures: link-in-bio hub

Static page listing every website, APK, EXE and tool we make. Free hosting on GitHub Pages, no build step.

## 1. Upload to the repo (OurAllProducts)
Easiest: open https://github.com/FullStackFailures/OurAllProducts, click **Add file → Upload files**, drag in everything from this folder (include the `.github` folder and `.nojekyll`), then **Commit changes** on the `main` branch.

Or with git:
```
git init
git add .
git commit -m "Launch link hub"
git branch -M main
git remote add origin https://github.com/FullStackFailures/OurAllProducts.git
git push -u origin main
```

## 2. Turn on Pages
Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Open the **Actions** tab, wait for "Deploy to GitHub Pages" to go green (about a minute).

## 3. Your link
- With the repo named `OurAllProducts`: https://fullstackfailures.github.io/OurAllProducts/
- Cleaner link: rename the repo to `FullStackFailures.github.io` (Settings → General → Repository name). The link becomes https://fullstackfailures.github.io/ . Push again or re-run the Action after renaming.

Put that link in the Instagram bio. Not the github.com repo link.

## Add a product
Edit `data/products.json` on GitHub (pencil icon), copy a product block, change it, commit. Live in about a minute.

| Field | Meaning |
|---|---|
| `title`, `description` | What people see |
| `type` | `website`, `apk`, `exe`, `tool`, `other` |
| `url` | Link to the site or file |
| `price` | Optional, e.g. `"Free"` or `"₹499"` |
| `version`, `size` | Optional |
| `icon` | Optional emoji or image path |
| `tags` | Optional search words |
| `featured` | `true` for the big "Start here" block (one product) |
| `new` | `true` shows a New badge |

New category: add it under `"types"` with `label`, `action`, `icon`.

## APK / EXE files
Repo **Releases → Draft a new release →** attach the file. Latest-file link:
`https://github.com/FullStackFailures/OurAllProducts/releases/latest/download/FILENAME`
(Releases allow 2 GB per file; files inside the repo max 100 MB.)

## Edit profile
`data/site.json`: bio, social links. Logo is `assets/logo.png`.

## Test locally
`python -m http.server`, then open http://localhost:8000
