<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Contact actions use the shared Button variants: a filled submission action and understated direct-contact links, keeping interaction styling consistent.
- Mount analytics consent once in the root layout so visitors can change choices on legal pages as well as the homepage.
- Keep website terms separate from project agreements; never invent cancellation, refund, registration or retention policies.
- Keep Turnstile widget ownership and localized recovery in the dedicated contact widget; callback updates must not recreate it, and resets must use its own widget ID.
- Count page views from resolved router transitions with an in-memory per-visit guard; consent UI renders and query/hash changes must not create events.
- Keep contact/consent interaction regressions in isolated Vitest browser-DOM tests with mocked submissions and analytics; never send real enquiries to test UX.
