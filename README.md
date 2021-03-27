# react-collapsible-paragraph

A Collapsible Paragraph Component for Reactjs

## Current works

Customizable _expan/collapse_ handler

## Install

```shell
yarn add react-collapsible-paragraph
# or
npm install react-collapsible-paragraph
```

## Usage

```jsx
import React from "react";
import Collapsible from "react-collapsible-paragraph";

function App() {
  return (
    <div style={{ lineHeight: "22px" }}>
      <Collapsible lines={2}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Collapsible>
    </div>
  );
}
```

## Essential

- `Collapsible` inherits its parentElement's `lineHeight` which is necessay for the collapse mechanism. Therefore, parent **must** provide `lineHeight` property

## Props

| Props     | Types                                | Expanation                                                                        | Default                                    |
| --------- | :----------------------------------- | :-------------------------------------------------------------------------------- | :----------------------------------------- |
| `lines`   | `number`                             | If the content is longer than a certain line number. The content can be collapsed | 2                                          |
| `locales` | `{expand: string; collapse: string}` | Locale for _expan/collapse_ handler based on controlled usage                     | `{expand: "expand", collapse: "collapse"}` |

## [Demo](https://codesandbox.io/s/demo-react-collapsible-paragraph-ifh1y)
