import { Locale } from ".";

const Ellipsis = "...";

const eleId = "collapsible-paragraph-helper";

function getDummyContainer() {
  let dummyContainer: HTMLDivElement;
  return function (width: number, lineHeight: number) {
    if (!dummyContainer) {
      dummyContainer = document.createElement("div");
      dummyContainer.setAttribute("aria-hidden", "true");
      dummyContainer.id = eleId;
      dummyContainer.style.position = "fixed";
      dummyContainer.style.left = "0";
      dummyContainer.style.width = `${width}px`;
      dummyContainer.style.height = "auto";
      dummyContainer.style.lineHeight = `${lineHeight}px`;
      dummyContainer.style.minHeight = "auto";
      dummyContainer.style.maxHeight = "auto";
      dummyContainer.style.top = "-999999px";
      dummyContainer.style.zIndex = "9001";
      dummyContainer.style.textOverflow = "clip";
      dummyContainer.style.whiteSpace = "pre-wrap";
      dummyContainer.style.wordBreak = "break-word";
      document.body.appendChild(dummyContainer);
    }
    if (dummyContainer.style.width !== `${width}px`) {
      dummyContainer.style.width = `${width}px`;
    }
    return dummyContainer;
  };
}

function generateHandlers(lineHeight: number, locales: Locale) {
  const button = document.createElement("span");
  button.style.display = "inline-block";
  button.style.lineHeight = `${lineHeight}px`;
  button.style.height = `${lineHeight}px`;
  button.style.marginLeft = "4px";
  const label = document.createTextNode(locales.expand);
  button.appendChild(label);
  return button;
}

export function getNumberFromPixel(pixel: string): number {
  return Number(/\d+/.exec(pixel)?.toString());
}

export function compute(
  originText: string,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number,
  locales: Locale,
  controlled: boolean,
) {
  const dummyContainer = getDummyContainer()(maxWidth, lineHeight);
  const textNode = document.createTextNode(originText);
  dummyContainer.appendChild(textNode);
  if (dummyContainer.offsetHeight <= maxHeight) {
    return { computed: false, text: originText };
  }

  originText += Ellipsis;

  if (!controlled) {
    dummyContainer.appendChild(generateHandlers(lineHeight, locales));
  }

  let start = 0;
  let end = originText.length - 1;

  while (start + 1 < end) {
    const mid = Math.floor((start + end) / 2);
    const curText = originText.slice(0, mid) + Ellipsis;
    textNode.textContent = curText;
    if (dummyContainer.offsetHeight <= maxHeight) {
      start = mid;
    } else {
      end = mid;
    }
  }
  textNode.textContent = originText.slice(0, start) + Ellipsis;
  if (dummyContainer.offsetHeight <= maxHeight) {
    return { text: originText.slice(0, start) + Ellipsis, computed: true };
  }
  return { text: originText.slice(0, end) + Ellipsis, computed: true };
}
