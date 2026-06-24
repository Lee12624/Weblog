import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children, ...props }) => (
      <h1 style={{ fontFamily: "var(--font-display)" }} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 style={{ fontFamily: "var(--font-display)" }} {...props}>
        {children}
      </h2>
    ),
    code: ({ children, ...props }) => (
      <code {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre {...props}>
        {children}
      </pre>
    ),
  };
}
