# Responsive interaction changes

FAQ plus indicators are 2.8 times the question font size, a 180% increase. They remain vertically centered, do not shrink, and rotate when their native details panel opens.

The hero uses a static supplied gate photograph behind its headline and supporting copy. Action links, the discovery link, captions, pause/play and numbered selectors have been removed. Static presentation avoids automatic motion without playback controls. Interior concepts remain available in the separate interiors section.

Action buttons have no decorative arrow icons. Labels are centered inside each control at all widths. Service enquiry actions use visible Enquire labels, and gallery controls use Previous and Next labels while retaining their accessible names, keyboard shortcuts and touch behavior.

Heading font sizes are 70% of the prior values, including every minimum, fluid viewport term, maximum and breakpoint override. Heading utility classes, error headings and shared dialog/card titles use the same reduction. Body copy, navigation labels and the decorative footer wordmark keep their existing sizes. The change uses font sizing rather than visual transforms so layout wraps around the actual smaller text.

The shared radius token is 12px at every viewport width. Tailwind radius variants resolve to that token, and legacy arbitrary rounded classes plus native controls are normalized by src/interaction.css. Components without visible rounded surfaces remain ordinary layout elements. Action buttons and button-style links use the light-blue hover token with navy text. Gallery image cards retain their button semantics and keyboard focus indicators but have no hover background, zoom, glow, outline or lift. Other cards and sections have no hover highlights, including the contact card and expanded FAQ panels. The footer wordmark is 50% larger than its previous responsive type scale, centered, and cropped to half its line height. The footer enquiry heading and explanatory paragraph have been removed; its existing enquiry form remains available.

Navigation indicates the currently viewed section. Scroll tracking runs at most once per animation frame, uses passive scroll listening, and removes its listeners on unmount. The mobile menu closes with Escape, restores focus to its trigger, and closes when resized to desktop navigation.

Both galleries use DesignLightbox: controlled selection, native previous/next buttons, arrow-key navigation, touch-swipe navigation, wraparound and a announced image counter. The existing Radix dialog supplies focus containment, Escape closure and trigger-focus restoration. A single-image category disables previous/next controls. No client data is uploaded.

Hover styling is limited to devices with a fine pointer and hover capability. Touch devices retain click/tap feedback, with at least 44px targets for image controls and dialog closure. Reduced-motion preferences remove decorative transitions and animated scrolling. Native forms retain validation and browser-only project-brief preparation.

Phone layouts use single columns for process steps, finish details and project designs. Form actions stack and long text wraps. Tablet spacing and landscape image viewers are adjusted independently. The centered logo, 15% size increase and 20% navbar-height reduction are retained.

Decision: use shared tokens, CSS states and one gallery viewer instead of separate device-specific components or an animation library. Revisit when real-device feedback identifies a platform-specific issue. Viewport and touch emulation are not a substitute for testing every physical device or browser engine.
