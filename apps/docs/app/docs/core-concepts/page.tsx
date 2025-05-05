import { heading, text, vstack } from "melony";

export default function Page() {
  return vstack({
    className: "gap-8 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Core Concepts" }),
      text({
        content:
          "Melony is a library designed for developers who prefer a more straightforward approach to UI development without the complexity of JSX. It's built on top of shadcn/ui and provides a comprehensive set of components that work seamlessly together.",
      }),
      heading({ content: "Function-Based Development" }),
      text({
        content:
          "Melony embraces a pure function-based approach to UI development. Instead of writing JSX, you use simple function calls like `button({ label: 'Click me' })`. Each function returns a ReactNode, rendering the corresponding UI component. This approach makes the code more readable and maintainable.",
      }),
      heading({ content: "State Management" }),
      text({
        content:
          "Melony comes with built-in state management for common components like forms and tables. For more complex state management needs, we recommend using external solutions like Zustand. This gives you the flexibility to choose the right tool for your specific requirements.",
      }),
      heading({ content: "Component Types" }),
      text({
        content:
          "Melony offers two main types of components:\n\n1. Presentational Components: These return JSX UI elements (e.g., buttons, inputs, cards)\n2. Utility Components: These don't return UI but provide functionality (e.g., toast notifications)",
      }),
      heading({ content: "Data Fetching" }),
      text({
        content:
          "Melony includes two powerful data fetching components:\n\n- Query Functions: For fetching data\n- Mutation Functions: For modifying data\n\nThese components are built on top of TanStack Query, handling all the complex setup and state management for you. This means you can focus on your application logic rather than the intricacies of data fetching.",
      }),
    ],
  });
}
