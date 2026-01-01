# Event-based Context for Web Components

This project implements a small pub-sub style context mechanism for native Web Components using DOM events. It allows descendant components to request a value from an ancestor provider and optionally subscribe to updates.

The implementation is inspired by the Web Components Context protocol proposal, but is intentionally minimal and exploratory rather than a full implementation.

## What currently works

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

## Pairing focus

One area that is currently underspecified is how **multiple providers for the same context** should behave (for example, nested `ThemeProvider` elements).

During the pairing session, I’d like to:

- Decide on a clear resolution rule (e.g. nearest provider wins)
- Reason through how DOM event bubbling affects that behavior
- Adjust the implementation to make the behavior explicit and well-defined

The goal is to explore event flow, lifecycle, and tradeoffs together rather than to build a complete framework.

## Other areas (optional)

If time permits, or if another direction seems more interesting during pairing, we could also explore:

- Error handling when no provider exists
- Edge cases around multiple subscriptions
- How context behaves when components are moved in the DOM
- Improving tests or test coverage

I’m open to adjusting focus based on the conversation.
