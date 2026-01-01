import { provideContext, consumeContext } from "./context.js";

const themeContext = Symbol("theme");

class ThemeProvider extends HTMLElement {
  static get observedAttributes() {
    return ["mode"];
  }

  #context;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Initialize context provider
    this.#context = provideContext(this, themeContext, { mode: this.mode });
    this.#render();
  }

  disconnectedCallback() {
    // Cleanup when provider is removed
    this.#context.dispose();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "mode") {
      this.mode = newValue;
    }

    this.#render();
  }

  get mode() {
    const attributeValue = this.getAttribute("mode");
    const context = this.#context?.getValue();

    if (attributeValue && ["light", "dark"].includes(attributeValue)) {
      return attributeValue;
    } else if (context.mode) {
      return context.mode;
    }

    return "light";
  }

  set mode(value) {
    if (value) {
      this.setAttribute("mode", value);
      this.#context.update({ mode: value });
    } else {
      this.removeAttribute("mode");
      this.#context.update({ mode: "light" });
    }
  }

  toggleTheme() {
    const theme = this.#context.getValue();
    const mode = theme.mode === "light" ? "dark" : "light";
    this.mode = mode;
    return mode;
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: contents; }
      </style>
      <div>
        <p>Theme Provider: mode = ${this.mode}</p>
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define("theme-provider", ThemeProvider);

class ThemedButton extends HTMLElement {
  #mode = "light";
  #unsubscribe;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Subscribe to theme context
    this.#unsubscribe = consumeContext(this, themeContext, (theme) => {
      this.mode = theme.mode;
    });

    this.#render();
  }

  disconnectedCallback() {
    this.#unsubscribe?.();
  }

  get mode() {
    return this.#mode;
  }

  set mode(value) {
    this.#mode = value;
    this.#render();
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: contents; }

        .button {
          all: unset;
          display: inline-block;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          box-shadow: 0 0 0.125rem hsl(0deg 0% 15%);
          user-select: none;
          background: var(--bg);
          color: var(--text);
        }

        .button--light {
          --bg: hsl(0 0% 98%);
          --text: hsl(0 0% 10%);
        }

        .button--dark {
          --bg: hsl(180 50% 10%);
          --text: hsl(0 0% 98%);
        }
      </style>

      <button type="button" class="button button--${this.mode}">
        Themed Button: mode = ${this.mode}
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("themed-button", ThemedButton);
