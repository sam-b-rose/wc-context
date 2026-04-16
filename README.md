# Event-based Context for Web Components

This project implements a small pub-sub style context mechanism for native Web Components using DOM events. It allows descendant components to request a value from an ancestor provider and optionally subscribe to updates.

The implementation is inspired by the Web Components Context protocol proposal, but is intentionally minimal and exploratory rather than a full implementation.

## Running the Demo

To run the demo with live reloading, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wc-context.git
   cd wc-context
   ```

2. Start the development server:
   ```bash
   npx live-server .
   ```

3. Open your browser and navigate to `http://localhost:8080` to see the demo in action.
4. (Optional) Run tests by navigating to `http://localhost:8080/tests.html`.

## Project structure

### `context.js`

- A `ContextRequestEvent` that bubbles through the DOM
- A `provideContext` helper that:
  - Responds to matching context requests
  - Supports one-time reads or subscriptions
  - Manages subscriber lifecycle
- A `consumeContext` helper for consumers

### `app.js`

- `ThemeProvider` custom element that provides a theme context
- `ThemedButton` custom element that consumes the theme context

### `index.html`

- A simple demo using `ThemeProvider` and `ThemedButton`

### `tests.html` / `context.test.js`

- Basic tests covering `provideContext` and `consumeContext`
