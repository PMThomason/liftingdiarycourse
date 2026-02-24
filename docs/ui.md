# UI Coding Standards

## Component Library

**ONLY shadcn/ui components are permitted for all UI elements in this project.**

- Do NOT create custom components
- Do NOT use other component libraries (MUI, Chakra, Radix directly, etc.)
- All UI must be composed exclusively from shadcn/ui components
- Install new shadcn/ui components as needed via `npx shadcn@latest add <component>`

## Date Formatting

Use the `date-fns` npm package for all date formatting. No other date libraries are permitted.

Dates must be formatted using ordinal day suffixes in the following pattern:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2025
4th Jun 2025
```

### Format Pattern
- Day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
- Abbreviated month name (3 letters)
- Full year (4 digits)

### Implementation

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}
```
