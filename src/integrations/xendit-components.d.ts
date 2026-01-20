/**
 * @public
 * Channel properties for a payment method or payment token.
 */
export declare interface ChannelProperties {
    [key: string]: ChannelPropertyPrimative | ChannelPropertyPrimative[] | ChannelProperties;
}

/**
 * @public
 */
export declare type ChannelPropertyPrimative = string | number | boolean | undefined;

/**
 * @public
 */
export declare type IframeAppearanceOptions = {
    /**
     * Limited styles applied to iframe inputs.
     */
    inputStyles?: {
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: string;
        lineHeight?: string;
        letterSpacing?: string;
        color?: string;
        backgroundColor?: string;
    };
    /**
     * Limited styles applied to iframe input placeholders.
     */
    placeholderStyles?: {
        color?: string;
    };
    /**
     * Custom font face to load within iframe fields.
     * If you use this, you don't need to specify fontFamily or fontWeight.
     */
    fontFace?: {
        /**
         * CSS font-face source descriptor (e.g. `url(...) format(...)`)
         */
        source: string;
        /**
         * Font face options. Font family and weight are set automatically.
         */
        descriptors?: Pick<FontFaceDescriptors, "display" | "style" | "stretch">;
    };
};

/**
 * @public
 * Event sometimes fired after submission, if an action is required.
 */
export declare class XenditActionBeginEvent extends Event {
    static type: "action-begin";
    constructor();
}

/**
 * @public
 * Event fired when an action ends, success or fail.
 */
export declare class XenditActionEndEvent extends Event {
    static type: "action-end";
    constructor();
}

/**
 * @public
 */
export declare class XenditComponents extends EventTarget {
    /**
     * @public
     * Initialize the SDK for a given session.
     *
     * You can get the components sdk key from the components_sdk_key field of the
     * `POST /sessions` or `GET /session` endpoints.
     *
     * This creates an object that can be used to create UI components, that allow
     * users to make payment or save tokens, using a variety of channels, depending on
     * the session configuration.
     *
     * @example
     * ```
     * // initialize
     * const components = new XenditComponents({
     *   componentsSdkKey: "your-session-client-key",
     * });
     * ```
     */
    constructor(options: XenditSdkOptions);
    /**
     * @public
     * Retrieve the xendit session object.
     */
    getSession(): XenditSession;
    /**
     * @public
     * Retrieve the customer ascociated with the session.
     */
    getCustomer(): XenditCustomer | null;
    /**
     * @public
     * Retrieve the list of payment channels available for this session.
     *
     * The channels are organized in a way that is appropriate to show to users.
     * You can use this to render your channel picker UI.
     *
     * You can pass `{filter: "CHANNEL_CODE"}` to filter channels by string or regexp.
     */
    getActiveChannelGroups(options?: XenditGetChannelsOptions): XenditPaymentChannelGroup[];
    /**
     * @public
     * Retrieve an unorganized list of payment channels available for this session.
     *
     * Use this when you need to search for specific channels. When rendering your UI,
     * consider using `getActiveChannelGroups` if you support many channels.
     *
     * You can pass `{filter: "CHANNEL_CODE"}` to filter channels by string or regexp.
     */
    getActiveChannels(options?: XenditGetChannelsOptions): XenditPaymentChannel[];
    /**
     * @public
     * Creates a drop-in UI component for selecting a channel and making payments.
     *
     * This returns a div immediately. The component will be populated after
     * initialization is complete. You should insert this div into the DOM.
     *
     * Calling this again will destroy it and return a new element. Manually
     * destroying the component is not necessary, removing it from the DOM is sufficient.
     *
     * @example
     * ```
     * const channelPickerDiv = components.createChannelPickerComponent();
     * document.querySelector(".payment-container").appendChild(channelPickerDiv);
     * ```
     */
    createChannelPickerComponent(): HTMLElement;
    /**
     * @public
     * Creates a UI component for making payments with a specific channel. It will
     * contain form fields, and/or instructions for the user.
     *
     * This also makes the provided channel "current", the `submit` method
     * will use that channel.
     *
     * This returns a div. You should insert this div into the DOM. Creating a new
     * component multiple times for the same channel will return the same component instance.
     *
     * Destroying the component manually is not necessary, removing it from the DOM is sufficient,
     * but if you want to clear the form state, you can do so with the `destroyComponent` method.
     *
     * @example
     * ```
     * const cardsChannel = components.getActiveChannels({ filter: "CARDS" })[0];
     * const paymentComponent = components.createChannelComponent(cardsChannel);
     * document.querySelector(".payment-container").appendChild(paymentComponent);
     * ```
     */
    createChannelComponent(channel: XenditPaymentChannel, active?: boolean): HTMLElement;
    /**
     * @public
     * Returns the current payment channel.
     */
    getCurrentChannel(): XenditPaymentChannel | null;
    /**
     * @public
     * Makes the given channel the current channel for submission.
     *
     * The current channel:
     *  - Is interactive if it has a form (other channel components are non-interactive)
     *  - Is used when `submit()` is called.
     *
     * Set to null to clear the current channel.
     */
    setCurrentChannel(channel: XenditPaymentChannel | null): void;
    /**
     * @public
     *
     * Reveals any hidden validation errors in the current channel's form. Does nothing if
     * there are no validation errors to show.
     *
     * Normally, validation errors on required fields are not shown if the user did not touch them.
     */
    showValidationErrors(): void;
    /**
     * @public
     * Creates a container element for rendering action UIs.
     *
     * For example, 3DS or QR codes.
     *
     * Create an action container before or during the action-begin event, and
     * the action UI will be rendered inside it.
     * Creating an action container during an action will throw an error.
     *
     * If no action container is created (or if the created container is removed from the DOM or is too small),
     * the SDK will create an action container (in a modal dialog) for you.
     */
    createActionContainerComponent(): HTMLElement;
    /**
     * @public
     * Destroys a component of any type created by the SDK. Removes it from the DOM if necessary.
     * Throws if the element is not a xendit component or if it was already destroyed.
     */
    destroyComponent(component: HTMLElement): void;
    /**
     * @public
     * Submit, makes a payment or saves a payment method for the current payment channel.
     *
     * Call this when your submit button is clicked. Listen to the events to know the status:
     *  - `submission-begin` and `submission-end` to know when submission is in progress (you should disable your UI during this time). Submission-end also provides a reason.
     *  - `action-begin` and `action-end` to know when user action is in progress
     *  - `will-redirect` when the user will be redirected to another page
     *  - `payment-[request|token]-[created|discarded]` informs you of the ID of the resource we create on the backend, and if/when it is discarded
     *  - `session-complete` when the payment request or token is successfully created (you should redirect the user to your confirmation page)
     *  - `session-expired-or-canceled` can happen at any time, but it's likely to happen on submission if the session expired or was cancelled during checkout
     *  - `submission-not-ready` fires before `submission-begin` to indicate that you cannot submit while a submission is in progress
     *
     * When a submission fails, you can try again by calling `submit()` again.
     * (The `session-expired-or-canceled` and `fatal-error` events are fatal, submission failure is normal and recoverable)
     *
     * This corresponds to the endpoints:
     *  - `POST /v3/payment_requests` for PAY sessions
     *  - `POST /v3/payment_tokens` for SAVE sessions
     */
    submit(): void;
    /**
     * @public
     * Cancels a submission.
     *
     * If a submission is in-flight, the request is cancelled. If an action is in progress,
     * the action is aborted. Any active PaymentRequest or PaymentToken is abandoned.
     *
     * Does nothing if there is no active submission.
     */
    abortSubmission(): void;
    /**
     * @public
     * Completes a payment in test mode.
     *
     * The session must be in test mode, and the session type must be PAY, and
     * the sdk must have an in-progress action, and the channel must be a QR, VA, or OTC channel.
     *
     * @example
     * ```
     * components.addEventListener("action-begin", () => {
     *   components.simulatePayment();
     * });
     * ```
     */
    simulatePayment(): void;
    /**
     * @public
     * The `init` event lets you know when the session data has been loaded.
     *
     * The `createChannelPickerComponent` method can be called before this event, but
     * most other functionaility needs to wait for this event.
     *
     * @example
     * ```
     * components.addEventListener("init", () => {
     *   components.getSession();
     * });
     * ```
     */
    addEventListener(name: "init", listener: XenditEventListener<XenditInitEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * The `submission-ready` and `submission-not-ready` events let you know when submission should be available.
     * If ready, you can call `submit()` to begin the payment or token creation process.
     *
     * "submission-ready" means a channel has been selected, and all required fields are populated,
     * and all fields are valid.
     *
     * Use this to enable/disable your submit button.
     *
     * @example
     * ```
     * components.addEventListener("submission-ready", () => {
     *   submitButton.disabled = false;
     * });
     * components.addEventListener("submission-not-ready", () => {
     *   submitButton.disabled = true;
     * });
     * ```
     */
    addEventListener(name: "submission-ready", listener: XenditEventListener<XenditReadyEvent>, options?: boolean | AddEventListenerOptions): void;
    addEventListener(name: "submission-not-ready", listener: XenditEventListener<XenditReadyEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * The `submission-begin` and `submission-end` events let you know when a submission is in progress.
     *
     * Use this to disable your UI while submission is in progress.
     *
     * In the case of successful submission, `submission-end` will be followed by `session-complete`.
     * In the case of failed submission, the SDK will return to the ready state and you can try submitting again.
     */
    addEventListener(name: "submission-begin", listener: XenditEventListener<XenditSubmissionBeginEvent>, options?: boolean | AddEventListenerOptions): void;
    addEventListener(name: "submission-end", listener: XenditEventListener<XenditSubmissionEndEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * The events `payment-request-created`, `payment-token-created`, `payment-request-discarded`, and `payment-token-discarded`
     * let you know when a payment request or payment token has been created (as part of a submission) or
     * discarded (by cancelling or failing a submission).
     */
    addEventListener(name: "payment-request-created", listener: XenditEventListener<XenditPaymentRequestCreatedEvent>, options?: boolean | AddEventListenerOptions): void;
    addEventListener(name: "payment-token-created", listener: XenditEventListener<XenditPaymentTokenCreatedEvent>, options?: boolean | AddEventListenerOptions): void;
    addEventListener(name: "payment-request-discarded", listener: XenditEventListener<XenditPaymentRequestDiscardedEvent>, options?: boolean | AddEventListenerOptions): void;
    addEventListener(name: "payment-token-discarded", listener: XenditEventListener<XenditPaymentTokenDiscardedEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * The `action-begin` and `action-end` events let you know when a user action is in progress.
     *
     * After submission, an action may be required (e.g. 3DS, redirect, QR code, etc.).
     * The SDK will control the UI for actions, you don't need to do anything.
     *
     * Avoid changing any application state while an action is in progress as it may be
     * confusing for the user or interrupt their payment attempt.
     *
     * `action-end` is fired after the action is done, successfully or not. Note that users can
     * voluntarily dismiss actions.
     */
    addEventListener(name: "action-begin", listener: XenditEventListener<XenditActionBeginEvent>, options?: boolean | AddEventListenerOptions): void;
    addEventListener(name: "action-end", listener: XenditEventListener<XenditActionEndEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * Event handler called just before the user is redirected to a third party site to
     * complete the payment.
     *
     * Since redirects are actions, this will always be preceded by an `action-begin` event.
     */
    addEventListener(name: "will-redirect", listener: XenditEventListener<XenditWillRedirectEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * Event handler called on success.
     * The payment has been made and/or the token has been created.
     */
    addEventListener(name: "session-complete", listener: XenditEventListener<XenditSessionCompleteEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * Event handler called when the session has expired or been cancelled.
     */
    addEventListener(name: "session-expired-or-canceled", listener: XenditEventListener<XenditSessionExpiredOrCanceledEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * Event handler called when something unrecoverable has happened. You should create a new
     * session and a new SDK instance.
     */
    addEventListener(name: "fatal-error", listener: XenditEventListener<XenditFatalErrorEvent>, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * Fallback overload.
     */
    addEventListener<K extends keyof XenditEventMap>(type: K, listener: (this: XenditComponents, ev: XenditEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
    /**
     * @public
     * Fallback overload.
     */
    removeEventListener<K extends keyof XenditEventMap>(type: K, listener: (this: XenditComponents, ev: XenditEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
    static amountFormat(amount: number, currency: string): string;
}

/**
 * @public
 * Test version of XenditComponents that uses mock data instead of API calls.
 * Use this class for testing and development purposes.
 *
 * The componentsSdkKey option is ignored.
 *
 * @example
 * ```
 * const testSdk = new XenditComponentsTest({});
 * ```
 */
export declare class XenditComponentsTest extends XenditComponents {
    /**
     * @public
     * Test SDK ignores componentsSdkKey and uses a mock key.
     */
    constructor(options: Omit<XenditSdkOptions, "componentsSdkKey"> & {
        componentsSdkKey?: string;
    });
}

/**
 * @public
 */
export declare interface XenditCustomer {
    id: string;
    type: "INDIVIDUAL";
    /**
     * E-mail address of customer.
     */
    email?: string;
    /**
     * Mobile number of customer in E.164 format +(country code)(subscriber number)
     */
    mobileNumber?: string;
    individualDetail: {
        /**
         * Primary or first name(s) of customer.
         */
        givenNames: string;
        /**
         * Last or family name of customer.
         */
        surname?: string;
    };
}

/**
 * @public
 */
export declare type XenditEventListener<T extends Event | XenditEventMap[keyof XenditEventMap]> = ((event: T) => void) | null;

/**
 * @public
 */
export declare type XenditEventMap = {
    init: XenditInitEvent;
    "submission-ready": XenditReadyEvent;
    "submission-not-ready": XenditReadyEvent;
    "action-begin": XenditActionBeginEvent;
    "action-end": XenditActionEndEvent;
    "will-redirect": XenditWillRedirectEvent;
    "session-complete": XenditSessionCompleteEvent;
    "session-expired-or-canceled": XenditSessionExpiredOrCanceledEvent;
    "payment-request-created": XenditPaymentRequestCreatedEvent;
    "payment-request-discarded": XenditPaymentRequestDiscardedEvent;
    "payment-token-created": XenditPaymentTokenCreatedEvent;
    "payment-token-discarded": XenditPaymentTokenDiscardedEvent;
    "fatal-error": XenditFatalErrorEvent;
};

/**
 * @public
 * Event fired when the SDK fails in an unrecoverable way.
 */
export declare class XenditFatalErrorEvent extends Event {
    /**
     * A detailed error message for developers. Don't show this to users.
     */
    message: string;
    static type: "fatal-error";
    constructor(
    /**
     * A detailed error message for developers. Don't show this to users.
     */
    message: string);
}

/**
 * @public
 * Options for retrieving payment channels.
 */
export declare interface XenditGetChannelsOptions {
    /**
     * Filter channels by their channel codes.
     * (If using a RegExp, do not use the `g` flag.)
     */
    filter: string | string[] | RegExp;
    /**
     * If true, channels that do not satisfy the session's min/max amount will be filtered out.
     * Default true.
     */
    filterMinMax?: boolean;
}

/**
 * @public
 * Event fired when the Session is loaded.
 */
export declare class XenditInitEvent extends Event {
    static type: "init";
    constructor();
}

/**
 * @public
 * Event fired when the SDK is not ready to submit.
 */
export declare class XenditNotReadyEvent extends Event {
    static type: "submission-not-ready";
    constructor();
}

/**
 * @public
 */
export declare interface XenditPaymentChannel {
    /**
     * The channel_code used to refer to this payment channel.
     *
     * This is either a string or an array of strings.
     *
     * In some cases (e.g. GOPAY), channels that are semantically the same have different channel codes depending
     * on whether they're being used for pay or pay and save. In that case this will be an array of two channel codes.
     */
    channelCode: string | string[];
    /**
     * The display name of the payment channel.
     */
    brandName: string;
    /**
     * The theme color associated with the payment channel, in hex format.
     *
     * This will always be suitable for use as a background color with white text.
     */
    brandColor: string;
    /**
     * The logo URL of the payment channel.
     */
    brandLogoUrl: string;
    /**
     * UI group to which this channel belongs.
     *
     * This is a suggestion for how to organize channels in your UI.
     */
    uiGroup: XenditPaymentChannelGroup;
    /**
     * The minimum amount for which this channel can be used.
     */
    minAmount?: number;
    /**
     * The maximum amount for which this channel can be used.
     */
    maxAmount?: number;
    /**
     * If this is a cards channel, the supported card brands.
     */
    cardBrands?: {
        name: string;
        logoUrl: string;
    }[];
}

/**
 * @public
 */
export declare interface XenditPaymentChannelGroup {
    /**
     * An arbitrary identifier.
     */
    groupId: string;
    /**
     * The display name of the group.
     */
    label: string;
    /**
     * The sort priority of the group.
     */
    channels: readonly XenditPaymentChannel[];
}

/**
 * @public
 */
export declare class XenditPaymentRequestCreatedEvent extends Event {
    paymentRequestId: string;
    static type: "payment-request-created";
    constructor(paymentRequestId: string);
}

/**
 * @public
 */
export declare class XenditPaymentRequestDiscardedEvent extends Event {
    paymentRequestId: string;
    static type: "payment-request-discarded";
    constructor(paymentRequestId: string);
}

/**
 * @public
 */
export declare class XenditPaymentTokenCreatedEvent extends Event {
    paymentTokenId: string;
    static type: "payment-token-created";
    constructor(paymentTokenId: string);
}

/**
 * @public
 */
export declare class XenditPaymentTokenDiscardedEvent extends Event {
    paymentTokenId: string;
    static type: "payment-token-discarded";
    constructor(paymentTokenId: string);
}

/**
 * @public
 * Event fired when the SDK is ready to submit.
 */
export declare class XenditReadyEvent extends Event {
    channelCode: string;
    static type: "submission-ready";
    constructor(channelCode: string);
}

/**
 * @public
 */
export declare interface XenditSdkOptions {
    /**
     * The client key from your session.
     * Your server should retrieve this from the Xendit API and pass it directly to the
     * client without saving or logging it anywhere.
     */
    componentsSdkKey: string;
    iframeFieldAppearance?: IframeAppearanceOptions;
}

/**
 * @public
 */
export declare interface XenditSession {
    /**
     * Session ID with prefix `ps-`.
     */
    id: string;
    /**
     * Description of the transaction provided by merchant on session creation.
     * The SDK does not use this, but you may show it to your users.
     */
    description?: string;
    /**
     * The type of session.
     *
     * PAY sessions create a payment request, calling /v3/payment_requests
     * SAVE sessions create a saved payment token, calling /v3/payment_tokens
     */
    sessionType: "PAY" | "SAVE";
    /**
     * The kind of session, only COMPONENT sessions can be used with the components SDK.
     */
    mode: "COMPONENTS";
    /**
     * Merchant provided identifier for the session.
     */
    referenceId: string;
    /**
     * ISO 3166-1 alpha-2 two-letter country code for the country of transaction.
     */
    country: string;
    /**
     * ISO 4217 three-letter currency code for the payment.
     */
    currency: string;
    /**
     * For mode=PAY, the amount to be collected.
     * For mode=SAVE, this will always be 0.
     */
    amount: number;
    /**
     * A map of channels to channel properties provided by merchant on session creation.
     *
     * Keys are channel codes in lowercase.
     */
    channelProperties?: Record<string, ChannelProperties>;
    /**
     * When the session will expire. After this, it cannot be used, you'll need to create a new session.
     */
    expiresAt: Date;
    /**
     * Locale code for the session.
     */
    locale: string;
    /**
     * Status of the session.
     */
    status: "ACTIVE" | "CANCELED" | "EXPIRED" | "COMPLETED";
    /**
     * Indicates whether the customer is allowed to save their payment method during this session.
     *
     * DISABLED means users do not have the option to save a payment method.
     * OPTIONAL means users are given a checkbox to choose whether to save their payment method.
     * FORCED means users must save their payment method and only channels that support saving will be shown.
     * undefined means the merchant has not specified this preference or this is not a PAY session.
     *
     * If the user wishes to save a payment method, `/v3/payment_requests` will be called with type="PAY_AND_SAVE".
     */
    allowSavePaymentMethod?: "DISABLED" | "OPTIONAL" | "FORCED";
    /**
     * Indicates whether the payment will be captured automatically or manually.
     */
    captureMethod?: "AUTOMATIC" | "MANUAL";
    /**
     * Line items. The components SDK does not use this, but you may show it to your users.
     */
    items?: {
        /**
         * The type of item
         */
        type: "DIGITAL_PRODUCT" | "PHYSICAL_PRODUCT" | "DIGITAL_SERVICE" | "PHYSICAL_SERVICE" | "FEE";
        /**
         * Your reference ID for the item.
         */
        referenceId?: string;
        /**
         * Name of the item.
         */
        name: string;
        /**
         * Price per item. Can be negative for discounts. Total line item amount is net_unit_amount * quantity.
         */
        netUnitAmount: number;
        /**
         * Number of items in this line item.
         */
        quantity: number;
        url?: string;
        imageUrl?: string;
        category?: string;
        subcategory?: string;
        description?: string;
        metadata?: Record<string, string>;
    }[];
}

/**
 * @public
 * Event fired when the session is complete, meaning the payment has been processed
 * or the token has been created.
 */
export declare class XenditSessionCompleteEvent extends Event {
    static type: "session-complete";
    constructor();
}

/**
 * @public
 * Event fired when the session has failed, meaning expired or cancelled.
 */
export declare class XenditSessionExpiredOrCanceledEvent extends Event {
    static type: "session-expired-or-canceled";
    constructor();
}

/**
 * @public
 * Event fired after submission begins.
 */
export declare class XenditSubmissionBeginEvent extends Event {
    static type: "submission-begin";
    constructor();
}

/**
 * @public
 * Event fired when a submission is complete or fails. Submission encompasses creation of a
 * payment request or payment token, and any actions the user needs to complete.
 *
 * Includes details about why the submission ended, and error messages if applicable.
 */
export declare class XenditSubmissionEndEvent extends Event {
    /**
     * The reason why the submission ended.
     */
    reason: string;
    /**
     * An error message to show to the user. A title and 1-2 lines of localized text.
     */
    userErrorMessage?: string[] | undefined;
    /**
     * A detailed error message for developers.
     */
    developerErrorMessage?: {
        /**
         * The type of error.
         * - NETWORK_ERROR: A network error occurred while creating the payment request or payment token.
         * - ERROR: Failed to created a payment request or payment token.
         * - FAILURE: A payment request or payment token transitioned to a failure state.
         */
        type: "NETWORK_ERROR" | "ERROR" | "FAILURE";
        /**
         * The code associated with the error.
         */
        code: string;
    } | undefined;
    static type: "submission-end";
    constructor(
    /**
     * The reason why the submission ended.
     */
    reason: string, 
    /**
     * An error message to show to the user. A title and 1-2 lines of localized text.
     */
    userErrorMessage?: string[] | undefined, 
    /**
     * A detailed error message for developers.
     */
    developerErrorMessage?: {
        /**
         * The type of error.
         * - NETWORK_ERROR: A network error occurred while creating the payment request or payment token.
         * - ERROR: Failed to created a payment request or payment token.
         * - FAILURE: A payment request or payment token transitioned to a failure state.
         */
        type: "NETWORK_ERROR" | "ERROR" | "FAILURE";
        /**
         * The code associated with the error.
         */
        code: string;
    } | undefined);
}

/**
 * @public
 * Event fired when the a redirect action is about to happen.
 */
export declare class XenditWillRedirectEvent extends Event {
    static type: "will-redirect";
    constructor();
}

export { }
