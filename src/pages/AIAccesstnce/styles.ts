import { useInsertionEffect } from "react";

/* Keyframes live here so the feature needs no Tailwind config.
 * Injected once; `prefers-reduced-motion` is respected. */

const STYLE_ID = "ai-assistance-styles";

const CSS = `
.ai-float{animation:ai-float 3.6s ease-in-out infinite}
.ai-shadow{animation:ai-shadow 3.6s ease-in-out infinite}
.ai-halo{transform-box:fill-box;transform-origin:center;animation:ai-halo 2.8s ease-in-out infinite}
.ai-halo[data-urgent="true"]{animation-duration:1.3s}
.ai-spin{transform-box:fill-box;transform-origin:center;animation:ai-spin 9s linear infinite}
.ai-spin[data-fast="true"]{animation-duration:1.3s}
.ai-bar{transform-box:fill-box;transform-origin:center;animation:ai-bar 1s ease-in-out infinite}
.ai-dot{transform-box:fill-box;transform-origin:center;animation:ai-dot 1.1s ease-in-out infinite}
.ai-twinkle{transform-box:fill-box;transform-origin:center;animation:ai-twinkle 3.2s ease-in-out infinite}
.ai-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:ai-draw .55s .1s ease-out forwards}
.ai-pop{animation:ai-pop .4s cubic-bezier(.34,1.56,.64,1) both}
.ai-fade-in{animation:ai-fade-in .28s ease-out both}
.ai-slide-in{animation:ai-slide-in .38s cubic-bezier(.22,1,.36,1) both}
.ai-ping{animation:ai-ping 1.7s cubic-bezier(0,0,.2,1) infinite}
.ai-caret{display:inline-block;width:2px;height:1em;margin-left:3px;vertical-align:-.15em;background:currentColor;animation:ai-blink 1s steps(1) infinite}
.ai-shimmer{background-size:200% 100%;animation:ai-shimmer 1.4s linear infinite}
@keyframes ai-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes ai-shadow{0%,100%{transform:scaleX(1);opacity:.4}50%{transform:scaleX(.82);opacity:.22}}
@keyframes ai-halo{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.045);opacity:.55}}
@keyframes ai-spin{to{transform:rotate(360deg)}}
@keyframes ai-bar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
@keyframes ai-dot{0%,100%{transform:scale(.72);opacity:.6}50%{transform:scale(1.15);opacity:1}}
@keyframes ai-twinkle{0%,100%{transform:scale(1);opacity:.95}50%{transform:scale(.7);opacity:.55}}
@keyframes ai-draw{to{stroke-dashoffset:0}}
@keyframes ai-pop{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes ai-fade-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes ai-slide-in{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
@keyframes ai-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.55);opacity:0}}
@keyframes ai-blink{50%{opacity:0}}
@keyframes ai-shimmer{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){
  .ai-float,.ai-shadow,.ai-halo,.ai-spin,.ai-bar,.ai-dot,.ai-twinkle,.ai-draw,.ai-pop,
  .ai-fade-in,.ai-slide-in,.ai-ping,.ai-caret,.ai-shimmer{
    animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important
  }
}
`;

export function useAIStyles() {
  useInsertionEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}
