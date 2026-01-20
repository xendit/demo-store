# How To Integrate

`XenditComponents.tsx` implements the example integration with Xendit Components on https://demo-store.xendit.co/.

In this example, we wrap the XenditComponents API in a React component.

```typescript
const XenditComponentsPayment: React.FC<{
  onSuccess: () => void;
  onFail: (message: string) => void;
  componentsKey: string;
}> => {
  // ...
}
```


## Create an instance of XenditComponents

We use a React ref to store our XenditComponents instance.

```typescript
const sdkRef = useRef<XenditComponents | null>(null);

useLayoutEffect(() => {
  const sdk = new Xenditcomponents.XenditComponents({
      sessionClientKey: componentsKey,
  });
  sdkRef.current = sdk;
}, [componentsKey]);
```


## Wait for initialization

Since we're creating a credit card component in this example, we need to wait for initialization.

If we were using the channel picker component, we would not need to do this.

```typescript
components.addEventListener("init", () => {
  // ...
});
```


## Select a channel

Since we're using one specific channel, we need to find that channel in the channels list. If the
channel is not available, it will not be returned from `getActiveChannels`.

```typescript
const cards = components.getActiveChannels({ filter: "CARDS" })[0];
```


## Create a component

Create a component for the chosen channel.

```typescript
const cardsComponent = components.createChannelComponent(cards);
```

This returns a `HTMLElement`, we need to mount it in our document.

```typescript
const containerRef = useRef<HTMLDivElement | null>(null);

useLayoutEffect(() => {
  const sdk = // ...
  components.addEventListener("init", () => {
    const cards = components.getActiveChannels({ filter: "CARDS" })[0];
    cardsComponent = components.createChannelComponent(cards);
    containerRef.current?.replaceChildren(cardsComponent);
  });
}, [componentsKey]);

return <div ref={containerRef}/>
```


## Monitoring readiness

We can monitor whether the user is ready to submit using the submission-ready and submission-not-ready event.

"Ready to submit" means a channel has been selected and all required fields are filled.

```typescript
components.addEventListener("submission-ready", () => {
  // ready
});
components.addEventListener("submission-not-ready", () => {
  // not ready
});
```


## Submission

When the user is ready to pay, call `submit()`.

Listen to the outcome using events.

```typescript
components.submit();
```


## Wait for success/failure

Listen for success or failure using the `session-complete` and `session-expired-or-canceled` events.

`session-expired-or-canceled` indicates a terminal failure, you need to create a new session to continue.

```typescript
components.addEventListener("session-complete", () => {
  // success, payment made or token created
});
components.addEventListener("session-expired-or-canceled", (event) => {
  // terminal failure
});
```


## Monitoring submission state

We can monitor the outcome of a submission using the `submission-begin` and `submission-end` events.

Use this to control pending UI states, and to find error messages and status codes when a submission fails.

```typescript
components.addEventListener("submission-begin", () => {
  // submitting
});
components.addEventListener("submission-end", (event) => {
  // submission has succeeded or failed
});
```

The `submission-end` event contains the outcome and reason for the event.

 * `reason` - Why the submission is ended, e.g. success (`SESSION_COMPLETE`), because of a network error (`REQUEST_FAILED`), because the user canceled (`ACTION_ABORTED`), or because the payment failed (`PAYMENT_REQUEST_FAILED`)
 * `userErrorMessage` - If an error occurred, this is an error message you may show to the user.
 * `developerErrorMessage` - More detailed data on why the error occurred. Do not show to the user.

A failed submission is not terminal, after `submission-end`, the state reverts to how it was before `submission-begin`, i.e. the user can try again.


## Monitoring actions

We can monitor when an action is in progress using the `action-begin` and `action-end` events.

In the action-begin event, if the action requires a UI, we can create a container for it and position it however we like. The action UI will be populated within.

```typescript
let actionContainer: HTMLElement | null = null;
components.addEventListener("action-begin", (event) => {
  actionContainer = components.createActionContainerComponent();
  document.body.appendChild(actionContainer);
});
components.addEventListener("action-end", (event) => {
  components.destroyComponent(actionContainer);
});
```


