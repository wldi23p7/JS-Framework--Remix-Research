---
title: useNavigate
---

# `useNavigate`

<docs-warning>It's usually better to use [`redirect`][redirect] in [`loaders`][loaders] and [`actions`][actions] than this hook</docs-warning>

The `useNavigate` hook returns a function that lets you navigate programmatically, for example in an effect:

```tsx
import { useNavigate } from "react-router-dom";

function useLogoutTimer() {
  const userIsInactive = useFakeInactiveUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userIsInactive) {
      fake.logout();
      navigate("/session-timed-out");
    }
  }, [userIsInactive]);
}
```

## Type Declaration

```tsx
declare function useNavigate(): NavigateFunction;

interface NavigateFunction {
  (
    to: To,
    options?: {
      replace?: boolean;
      state?: any;
      relative?: RelativeRoutingType;
    }
  ): void;
  (delta: number): void;
}
```

The `navigate` function has two signatures:

- Either pass a `To` value (same type as `<Link to>`) with an optional second `{ replace, state }` arg or
- Pass the delta you want to go in the history stack. For example, `navigate(-1)` is equivalent to hitting the back button.

If using `replace: true`, the navigation will replace the current entry in the history stack instead of adding a new one.

[redirect]: ../fetch/redirect
[loaders]: ../route/loader
[actions]: ../route/action
