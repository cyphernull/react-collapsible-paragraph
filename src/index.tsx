import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import "./style.scss";
import { compute, getNumberFromPixel } from "./utils";

export type Locale = {
  expand: string;
  collapse: string;
};

export interface CollapsibleParagraphProps {
  lines: number;
  expand?: boolean;
  locales?: Locale;
}

const CollapsibleParagraph: FC<CollapsibleParagraphProps> = ({
  lines,
  children,
  locales,
  expand,
}) => {
  const lastWidth = useRef<number>();
  const originalText = useRef<string>();
  const lastComputedText = useRef<string>();
  const paragraph = useRef<HTMLParagraphElement | null>(null);
  const observer = useRef<ResizeObserver>();

  const [text, setText] = useState<string>();
  const [showHandler, setShowHandler] = useState<boolean>(false);
  const [isExpand, setIsExpand] = useState<boolean>(false);

  const getComputedText = useCallback(
    (originText: string, maxWidth: number, lineHeight: number) => {
      return compute(
        originText,
        maxWidth,
        lineHeight * lines,
        lineHeight,
        locales!,
        typeof expand === "boolean",
      );
    },
    [lines, locales, expand],
  );

  const toggleExpand = useCallback(() => {
    if (isExpand) {
      setText(lastComputedText.current);
    } else {
      setText(originalText.current);
    }
    setIsExpand(isExpand => !isExpand);
  }, [isExpand]);

  useEffect(() => {
    if (typeof children !== "string") {
      throw new Error("The type of children must be `string`");
    }
    originalText.current = children;
  }, [children]);

  useEffect(() => {
    if (
      paragraph.current &&
      paragraph.current.parentElement &&
      originalText.current
    ) {
      let { lineHeight, paddingLeft, paddingRight } = window.getComputedStyle(
        paragraph.current.parentElement,
      );

      let lineHeightNumber: number;

      if (lineHeight === "normal") {
        lineHeightNumber = 16;
      } else {
        lineHeightNumber = getNumberFromPixel(lineHeight);
      }

      // clear observer first
      if (observer.current) {
        observer.current.disconnect();
      }

      // update computation when container gets resized
      observer.current = new ResizeObserver(entries => {
        if (!originalText.current) return;
        const container = entries[0];
        const {
          contentRect: { width },
        } = container;

        if (lastWidth.current === width) {
          return;
        }

        lastWidth.current = width;

        const computed = getComputedText(
          originalText.current,
          width -
            getNumberFromPixel(paddingLeft) -
            getNumberFromPixel(paddingRight),
          lineHeightNumber,
        );
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

  return (
    <p ref={paragraph} className="react-foldable-paragraph-v-1-0-0">
      {text}
      {showHandler && (
        <span
          className="react-foldable-paragraph-v-1-0-0-handler"
          onClick={toggleExpand}
        >
          {isExpand ? locales?.collapse : locales?.expand}
        </span>
      )}
    </p>
  );
};

CollapsibleParagraph.defaultProps = {
  lines: 2,
  locales: {
    expand: "expand",
    collapse: "collapse",
  },
};

export default CollapsibleParagraph;
