# Checklist updates
- [x] Add website terms and clarify project cancellation/refund terms without inventing business policies.
- [x] Correct privacy disclosures and add reversible analytics choices and contact privacy notice.
- [x] Audit security and address verified source issues.
- [x] Verify policy links, consent controls, form errors and mobile layout.
- [ ] Activate Turnstile: requires the owner's Cloudflare site and secret keys.
- [ ] Finalise business disclosures: requires registered business name/address, project refund rules and confirmation of image rights from the owner.
- [x] Recover and permanently save the flux-eng design feedback visible in the earlier chat.
- [x] Read the complete flux-eng board and compile its design guidance in design-brief.md.
- [x] Keep the main site unchanged and build the redesign as a separate source package without publishing.
- [x] Deliver the complete redesigned website source as a verified ZIP.

## Contact and consent UX fixes
- [x] Focus committed form errors in form order, mark required fields, and prevent overlapping submissions.
- [x] Stabilise Turnstile lifecycle and add localized retry/email fallback without changing server validation.
- [x] Track consent-granted pathname transitions once without expanding analytics data.
- [x] Run existing and regression tests, targeted lint, automatic build, and intercepted preview checks without a real enquiry.
- [ ] Confirm a separate TypeScript check: the running checker service is unavailable (`oj dev-typecheck` reports no dev server); automatic build checks are clean.
