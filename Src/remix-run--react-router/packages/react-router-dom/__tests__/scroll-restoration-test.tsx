import { JSDOM } from "jsdom";
import * as React from "react";
import { render, prettyDOM, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Link,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";

describe(`ScrollRestoration`, () => {
  it("removes the basename from the location provided to getKey", () => {
    let getKey = jest.fn(() => "mykey");
    let testWindow = getWindowImpl("/base");
    window.scrollTo = () => {};

    let router = createBrowserRouter(
      [
        {
          path: "/",
          Component() {
            return (
              <>
                <Outlet />
                <ScrollRestoration getKey={getKey} />
              </>
            );
          },
          children: [
            {
              index: true,
              Component() {
                return <Link to="/page">/page</Link>;
              },
            },
            {
              path: "page",
              Component() {
                return <h1>Page</h1>;
              },
            },
          ],
        },
      ],
      { basename: "/base", window: testWindow }
    );
    let { container } = render(<RouterProvider router={router} />);

    expect(getKey.mock.calls.length).toBe(1);
    // @ts-expect-error
    expect(getKey.mock.calls[0][0].pathname).toBe("/"); // restore

    expect(getHtml(container)).toMatch("/page");
    fireEvent.click(screen.getByText("/page"));
    expect(getHtml(container)).toMatch("Page");

    expect(getKey.mock.calls.length).toBe(3);
    // @ts-expect-error
    expect(getKey.mock.calls[1][0].pathname).toBe("/"); // save
    // @ts-expect-error
    expect(getKey.mock.calls[2][0].pathname).toBe("/page"); // restore
  });
});

function getWindowImpl(initialUrl: string): Window {
  // Need to use our own custom DOM in order to get a working history
  const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost/" });
  dom.window.history.replaceState(null, "", initialUrl);
  return dom.window as unknown as Window;
}

function getHtml(container: HTMLElement) {
  return prettyDOM(container, undefined, {
    highlight: false,
    theme: {
      comment: null,
      content: null,
      prop: null,
      tag: null,
      value: null,
    },
  });
}
