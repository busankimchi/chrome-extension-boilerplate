const addScriptToWindow = (scriptLocation: string): void => {
  try {
    const container = document.head || document.documentElement;
    const script = document.createElement("script");

    script.setAttribute("async", "false");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", scriptLocation);
    container.insertBefore(script, container.children[0]);
    container.removeChild(script);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to inject script\n", e);
  }
}

console.log("content script");

// inject the "injected.ts" script
addScriptToWindow(chrome.extension.getURL("/build/injected.js"));

export {};