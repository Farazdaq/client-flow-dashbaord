import { useEffect } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Logo from "./Logo";

export function useFavicon() {
  useEffect(() => {
    const svg = renderToStaticMarkup(createElement(Logo, { className: "" }));
    const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = href;
  }, []);
}
