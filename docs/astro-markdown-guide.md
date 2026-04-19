# Astro Markdown Guide

This guide covers how to use Markdown effectively in your Astro project, including advanced features, code fences, and best practices for content authors.

---

## Supported Markdown Features

Astro supports standard Markdown syntax and many extended features:

- Headings (`#`, `##`, `###`, etc.)
- Emphasis (`*italic*`, `**bold**`)
- Lists (ordered and unordered)
- Links and images
- Blockquotes
- Tables
- Code blocks (fenced and indented)
- Task lists
- Horizontal rules (`---`)
- Inline HTML
- Frontmatter (YAML)
- MDX (if enabled)

See the [Astro Markdown Content Guide](https://docs.astro.build/en/guides/markdown-content/) for more.

---

## Using Code Fences

Code fences are the best way to display multi-line code blocks with syntax highlighting in Markdown. Astro supports GitHub-flavored Markdown code fences.

### Basic Syntax

Wrap your code with three backticks (```) before and after:

````markdown
```
Your code here
```
````

### Language Highlighting

Specify a language after the opening backticks for syntax highlighting:

````markdown
```js
console.log('Hello, Astro!');
```
````

Supported languages include: `js`, `ts`, `python`, `bash`, `json`, `html`, `css`, and more.

### Inline Code

For short code snippets, use single backticks: `like this`.

### Tips for Code Fences

- Use code fences for multi-line code or when you want to preserve indentation.
- Indent code blocks inside lists by at least four spaces or one tab.
- Avoid using code fences inside YAML frontmatter (the section between --- lines at the top of Markdown files).
- For MDX files, you can use JSX/React components inside code fences, but they will be rendered as code, not executed.

### Example

````markdown
```python
def greet(name):
    print(f"Hello, {name}!")
```
````

---

## Advanced Markdown (MDX)

If you use `.mdx` files and have the MDX integration enabled, you can import and use components directly in your Markdown:

```mdx
import MyComponent from '../components/MyComponent.astro';

<MyComponent />
```

---

## Best Practices

- Use headings to structure your content.
- Prefer code fences for all code examples.
- Use tables for structured data.
- Use task lists for checklists in docs.
- Use frontmatter for metadata (title, date, tags, etc.).
- Use relative paths for images and assets.

---

For more, see the [Astro Markdown Docs](https://docs.astro.build/en/guides/markdown-content/) and [CommonMark Spec](https://spec.commonmark.org/0.30/#fenced-code-blocks).
