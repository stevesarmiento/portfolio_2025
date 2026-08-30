# Writing a Musing

1. Duplicate `_template.mdx` and rename it with a lowercase, hyphenated slug,
   for example `small-tools.mdx`.
2. Fill in the exported `article` object. Dates must use `YYYY-MM-DD`.
3. Keep `draft: true` while working. Drafts render in development and are
   excluded from production builds.
4. Begin article content at `##`. The route supplies the only `h1`.
5. Put article images in `public/img/writings/` and include meaningful alt
   text: `![Description](/img/writings/example.png)`.

## Code blocks

Fenced code blocks are highlighted automatically. Add an optional filename and
line highlights with this syntax:

````md
```tsx title="example.tsx" {2-3}
const example = {
  thoughtful: true,
};
```
````

Every fenced block receives one accessible copy button.

## Available components

The global MDX component set includes:

- `Callout` with optional `title` and `tone="note|idea|caution"`
- `Figure` with an optional `caption`
- `DemoFrame` with an optional `title`
- `SectionDivider` with an optional `label`
- `PropertyList` with an `items` array

Article-specific interactive components can be imported directly from
`@/components/writings/`.
