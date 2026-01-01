import { provideContext, consumeContext } from "./context.js";

describe("context", () => {
  let context = null;
  let unsubscribe = null;
  let currentConsumerValue = null;

  const parent = document.createElement("div");
  const child = document.createElement("div");
  parent.appendChild(child);

  beforeEach(() => {
    context = provideContext(parent, "mode", "light");
    unsubscribe = consumeContext(child, "mode", (value) => {
      currentConsumerValue = value;
    });
  });

  afterEach(() => {
    currentConsumerValue = null;
    context?.dispose();
    unsubscribe();
  });

  it("consumer should receive the context value from the provider", () => {
    expect(currentConsumerValue).toEqual("light");
  });

  it("methods can update, getValue, and dispose", () => {
    // update context
    context.update("dark");
    expect(currentConsumerValue).toEqual("dark");

    // context value matched currentConsumerValue
    const contextValue = context.getValue();
    expect(contextValue).toEqual(currentConsumerValue);

    // dispose removes all event listeners and subscribers
    context.dispose();
    context.update("new-value");
    expect(currentConsumerValue).not.toEqual("new-value");
    expect(currentConsumerValue).toEqual("dark");
  });
});
