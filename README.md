# Notes

## Role `log` vs. `status`

Regardless of their DOM position, `log` will always spoken before `status`. If `status` is currently speaking, a change to `log` will interrupt `status`.

Screen reader should have a special key to announce the `status` immediately. Windows Narrator does not have this feature.

## Conflicting `live-region`

You can set multiple elements to be speaking on change (a.k.a. live region). But if you have multiple live regions on the page, they will race with each other, and some regions may not speak at all.

## Carefully using React key

When React key changed but the element kept the same, React will recreate the element.

If the element live inside a "live" region, it will be narrated twice because the element is being recreated.

## List using `<ul>` and `<ol>` is good for short list

If your list is a transcript with 100+ items, it will keep saying "one of one hundred level one", which is a bit annoying. To mitigate, we can add `role="presentation"`.

## Reading order

Unlike visible UI, you cannot reorder elements to be spoken by screen reader, they must follow the natural DOM order. So, no `z-index` for screen reader. When building the DOM, you must make sure the narration flow is compatible with the DOM tree.

You should always build a web page with good DOM tree first, then decorate and style it with CSS later.

## Live region is for update only

Live region will be narrated when its content is added/removed/changed. It will not be narrated initially. And there is no way to programmatically way to ask the screen reader to say something.

Some roles will be marked as "live region" automatically, for example, `role="status"`.

## React vs. live region

Live region is a browser feature and it essentially looks for changes in the DOM tree and narrate them. When handling live region with React, extra careful need to be made to make sure unnecessary DOM changes are prevent and all related changes are grouped in a single render loop.

## Screen reader vs. text-to-speech

Although, screen reader is technically TTS, screen reader are not programmable, and TTS are mostly programmable. And as advised by legal team, we are not allowed to use TTS as an alternative way for screen reader.

In Web Chat, TTS is a personal assistant experience with fluent spoken language capabililty. For example, TTS will not narrate the sentence the user type. But in screen reader mode, it is reading everything visible on the screen, including what the user typed.

## Dedicating UI for screen reader experience

Instead of fixing/enhancing the existing UI to have better support of screen reader, a dedicated UI element could be used instead, with cautions:

- Screen reader and non-screen reader experience must both represent same set of data
   - "If the user can see it, they should be able to hear it"
   - "If the user can hear it, they should be able to see it"
- Elements with focus
   - If elements can be focused are put inside the screen reader experience, it will be difficult for non screen reader user to interact with them
   - For interactive elements, don't put it on dedicated element, enhance the existing one instead
- Always consult with legal team
   - Differentiating code for screen reader and non-screen reader users is risky if not done properly

## Focus management

In Web Chat, if the user clicked on card action, instead of submitting text thru send box, we should put the user focus back on the send box because this is naturally they think they will be focused on.
