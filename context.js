/**
 * Request event that carries a context value to specify what data to request
 * and a callback which will receive the data.
 */
class ContextRequestEvent extends Event {
  static eventName = "context-request";

  context;
  callback;
  subscribe;

  constructor(context, callback, subscribe = false) {
    super(ContextRequestEvent.eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.context = context;
    this.callback = callback;
    this.subscribe = subscribe;
  }
}

/**
 * Creates the context object and adds event listeners for context request.
 *
 * @param {HTMLElement} element Element to contain the context data and respond to requests
 * @param {string|symbol} context Unique key identifier for the context
 * @param {*} initialValue Data to store in the context
 * @returns Context object with methods getValue, update, and dispose
 */
export function provideContext(element, context, initialValue) {
  let currentValue = initialValue;
  const subscribers = new Set();

  const handleRequest = (event) => {
    const requestEvent = event;

    if (requestEvent.context !== context) {
      return;
    }

    event.stopImmediatePropagation();

    if (requestEvent.subscribe) {
      subscribers.add(requestEvent.callback);
      const unsubscribe = () => subscribers.delete(requestEvent.callback);
      requestEvent.callback(currentValue, unsubscribe);
    } else {
      requestEvent.callback(currentValue);
    }
  };

  element.addEventListener(ContextRequestEvent.eventName, handleRequest);

  return {
    getValue: () => currentValue,

    update: (value) => {
      currentValue = value;
      subscribers.forEach((callback) => {
        const unsubscribe = () => subscribers.delete(callback);
        callback(value, unsubscribe);
      });
    },

    dispose: () => {
      element.removeEventListener(ContextRequestEvent.eventName, handleRequest);
      subscribers.clear();
    },
  };
}

/**
 * @callback ContextRequestCallback
 * @template T Type of the requested context's value
 * @param {T} value Value of the requested context
 * @returns {void}
 */

/**
 * Dispatches a context request event to get data from a parent context
 *
 * @param {HTMLElement} element Element which to dispatch the context request event
 * @param {string|symbol} context Context key to specify which data to request
 * @param {ContextRequestCallback} callback Callback to run when the context request is fulfilled or updated
 * @param {boolean} subscribe Subscribe to future context updates
 * @returns {function(): void} Unsubscribes from the context}
 */
export function consumeContext(element, context, callback, subscribe = true) {
  let unsubscribeFn;

  const requestEvent = new ContextRequestEvent(
    context,
    (value, unsubscribe) => {
      unsubscribeFn = unsubscribe;
      callback(value);
    },
    subscribe,
  );

  element.dispatchEvent(requestEvent);

  return () => unsubscribeFn?.();
}
