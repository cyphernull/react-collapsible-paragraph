import { FC } from "react";
import "./style.scss";
export declare type Locale = {
    expand: string;
    collapse: string;
};
export interface CollapsibleParagraphProps {
    lines: number;
    expand?: boolean;
    locales?: Locale;
}
declare const CollapsibleParagraph: FC<CollapsibleParagraphProps>;
export default CollapsibleParagraph;
