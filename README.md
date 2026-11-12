# 🛡️ Vulnerability Disclosures


This repository is a centralized hub dedicated to vulnerability research and coordinated disclosure.  
My goal is to proactively secure the open-source ecosystem by identifying, documenting, and helping remediate security flaws.


I strictly adhere to responsible and coordinated vulnerability disclosure principles. Maintainers are always contacted first, and details are only made public once a patch is available or after the standard industry grace period.

## Research archive

The public site is a static Vite build (TypeScript, React, SCSS, a small Three.js field). It reads typed JSON. The markdown notes stay next to each CVE and remain the original write-up.

```bash
npm install
npm run dev
```

`npm run build` writes `dist/` for the user site at `https://n0tfix3d.github.io/`. The publishing repository must be named `n0tfix3d.github.io`. `npm run preview` serves that build. `npm test` checks the query logic and that every JSON article, figure, and markdown note still lines up.

### Where the data lives

| File | Role |
| --- | --- |
| `content/profile.json` | Name, focus, and the practice essay |
| `content/severities.json` | Critical through None, with the text for each band |
| `content/categories.json` | Weakness classes and the text for each class |
| `<Product>/<CVE-ID>/<CVE-ID>.json` | Article sections, timeline, references, figure paths |
| `<Product>/<CVE-ID>/<CVE-ID>.md` | Original disclosure notes |

Article body is structured rich text (`paragraph`, `heading`, `list`, `code`, `quote`, `image`, `callout`), not HTML. Image paths are repository-relative, for example `YesWiki/CVE-2026-52778/images/0.png`.

To add a disclosure: keep the markdown notes, add a `CVE-*.json` file beside them, and register the product folder in `src/infrastructure/json/json-disclosure-repository.ts` if it is not YesWiki, Bludit CMS, or phpMyFAQ. Category and severity ids have to exist in the catalog files.

### Swapping the data source

The UI talks to repository ports. The default adapters read the JSON files. Set `VITE_DATA_SOURCE=http` and `VITE_API_BASE_URL` to use the HTTP adapters instead. That API has to return the same documents:

- `GET /profile`
- `GET /catalog` with `severities` and `categories`
- `GET /disclosures` as an array of article documents
- `GET /disclosures/:id` for one article, or `404`


| Product | Vulnerability Type | Severity | CVE | Evidence |
| --- | --- | --- | --- | --- |
| **YesWiki <=4.6.5** | Unsafe eval() in Formula Calculator - Remote Code Execution (RCE) & Denial of Service (DoS)| ⚫ Critical| CVE-2026-52778| [PoC](./YesWiki/CVE-2026-52778/CVE-2026-52778.md) |
| **phpMyFAQ < 4.1.4** | Weak Cryptography - SHA1 for Password Hashing| 🟢 Low | CVE-2026-48488| [PoC](./phpMyFAQ/CVE-2026-48488/CVE-2026-48488.md) |
| **Bludit CMS < 3.22.0** | Improper Authorization and Mediation Failure leading to Persistent Ghost Sessions | 🔴 High | CVE-2026-46656 | [PoC](./BluditCMS/CVE-2026-46656/CVE-2026-46656.md) |
| **Bludit CMS < 3.22.0** | Persistent Authentication Tokens not Revoked upon Account Disablement | 🔴 High | CVE-2026-46657 | [PoC](./BluditCMS/CVE-2026-46657/CVE-2026-46657.md) |

