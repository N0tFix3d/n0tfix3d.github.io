# 🛡️ Vulnerability Disclosures


This repository is a centralized hub dedicated to vulnerability research and coordinated disclosure.  
My goal is to proactively secure the open-source ecosystem by identifying, documenting, and helping remediate security flaws.


I strictly adhere to responsible and coordinated vulnerability disclosure principles. Maintainers are always contacted first, and details are only made public once a patch is available or after the standard industry grace period.


| Product | Vulnerability Type | Severity | CVE | Evidence |
| --- | --- | --- | --- | --- |
| **YesWiki <=4.6.5** | Unsafe eval() in Formula Calculator - Remote Code Execution (RCE) & Denial of Service (DoS)| ⚫ Critical| CVE-2026-52778| [PoC](./YesWiki/CVE-2026-52778/CVE-2026-52778.md) |
| **phpMyFAQ < 4.1.4** | Weak Cryptography - SHA1 for Password Hashing| 🟢 Low | CVE-2026-48488| [PoC](./phpMyFAQ/CVE-2026-48488/CVE-2026-48488.md) |
| **Bludit CMS < 3.22.0** | Improper Authorization and Mediation Failure leading to Persistent Ghost Sessions | 🔴 High | CVE-2026-46656 | [PoC](./BluditCMS/CVE-2026-46656/CVE-2026-46656.md) |
| **Bludit CMS < 3.22.0** | Persistent Authentication Tokens not Revoked upon Account Disablement | 🔴 High | CVE-2026-46657 | [PoC](./BluditCMS/CVE-2026-46657/CVE-2026-46657.md) |

