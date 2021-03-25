

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

___$insertStyle(".react-foldable-paragraph-v-1-0-0 {\n  all: unset !important;\n  width: 100%;\n}\n\n.react-foldable-paragraph-v-1-0-0-handler {\n  float: right;\n  cursor: pointer;\n  color: #1a73e8;\n}\n\n.react-foldable-paragraph-v-1-0-0-handler:hover {\n  color: #4694fa;\n}\n\n.react-foldable-paragraph-v-1-0-0-handler:active {\n  color: #155fbf;\n}");

const Ellipsis = "...";
const eleId = "collapsible-paragraph-helper";
function getDummyContainer() {
    let dummyContainer;
    return function (width, lineHeight) {
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
function generateHandlers(lineHeight, locales) {
    const button = document.createElement("span");
    button.style.display = "inline-block";
    button.style.lineHeight = `${lineHeight}px`;
    button.style.height = `${lineHeight}px`;
    button.style.marginLeft = "4px";
    const label = document.createTextNode(locales.expand);
    button.appendChild(label);
    return button;
}
function getNumberFromPixel(pixel) {
    var _a;
    return Number((_a = /\d+/.exec(pixel)) === null || _a === void 0 ? void 0 : _a.toString());
}
function compute(originText, maxWidth, maxHeight, lineHeight, locales, controlled) {
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
        }
        else {
            end = mid;
        }
    }
    textNode.textContent = originText.slice(0, start) + Ellipsis;
    if (dummyContainer.offsetHeight <= maxHeight) {
        return { text: originText.slice(0, start) + Ellipsis, computed: true };
    }
    return { text: originText.slice(0, end) + Ellipsis, computed: true };
}

const CollapsibleParagraph = ({ lines, children, locales, expand, }) => {
    const lastWidth = React.useRef();
    const originalText = React.useRef();
    const lastComputedText = React.useRef();
    const paragraph = React.useRef(null);
    const observer = React.useRef();
    const [text, setText] = React.useState();
    const [showHandler, setShowHandler] = React.useState(false);
    const [isExpand, setIsExpand] = React.useState(false);
    const getComputedText = React.useCallback((originText, maxWidth, lineHeight) => {
        return compute(originText, maxWidth, lineHeight * lines, lineHeight, locales, typeof expand === "boolean");
    }, [lines, locales, expand]);
    const toggleExpand = React.useCallback(() => {
        if (isExpand) {
            setText(lastComputedText.current);
        }
        else {
            setText(originalText.current);
        }
        setIsExpand(isExpand => !isExpand);
    }, [isExpand]);
    React.useEffect(() => {
        if (typeof children !== "string") {
            throw new Error("The type of children must be `string`");
        }
        originalText.current = children;
    }, [children]);
    React.useEffect(() => {
        if (paragraph.current &&
            paragraph.current.parentElement &&
            originalText.current) {
            let { lineHeight, paddingLeft, paddingRight } = window.getComputedStyle(paragraph.current.parentElement);
            let lineHeightNumber;
            if (lineHeight === "normal") {
                lineHeightNumber = 16;
            }
            else {
                lineHeightNumber = getNumberFromPixel(lineHeight);
            }
            // clear observer first
            if (observer.current) {
                observer.current.disconnect();
            }
            // update computation when container gets resized
            observer.current = new ResizeObserver(entries => {
                if (!originalText.current)
                    return;
                const container = entries[0];
                const { contentRect: { width }, } = container;
                if (lastWidth.current === width) {
                    return;
                }
                lastWidth.current = width;
                const computed = getComputedText(originalText.current, width -
                    getNumberFromPixel(paddingLeft) -
                    getNumberFromPixel(paddingRight), lineHeightNumber);
                console.log(computed);
                setShowHandler(computed.computed);
                if (!isExpand) {
                    setText(computed.text);
                }
                lastComputedText.current = computed.text;
            });
            // observe
            observer.current.observe(paragraph.current.parentElement);
        }
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [getComputedText, isExpand]);
    return (React__default['default'].createElement("p", { ref: paragraph, className: "react-foldable-paragraph-v-1-0-0" },
        text,
        showHandler && (React__default['default'].createElement("span", { className: "react-foldable-paragraph-v-1-0-0-handler", onClick: toggleExpand }, isExpand ? locales === null || locales === void 0 ? void 0 : locales.collapse : locales === null || locales === void 0 ? void 0 : locales.expand))));
};
CollapsibleParagraph.defaultProps = {
    lines: 2,
    locales: {
        expand: "expand",
        collapse: "collapse",
    },
};

exports.default = CollapsibleParagraph;
//# sourceMappingURL=index.js.map
