# DOCTORE — Affiliate Transparency

## Core rule

Affiliate compensation must never influence PLAY, AVOID, or WAIT.

Decision logic and commercial presentation must stay separate.

## User-facing principle

Users must understand when DOCTORE may earn commission from sportsbook links.

Transparency is not a legal footnote. It is part of the product trust model.

## Short disclosure

> Some sportsbook links may be affiliate links. DOCTORE may earn commission. This does not affect the decision state shown.

## Full disclosure

> DOCTORE may earn commission when users sign up or place bets through partner sportsbook links. Affiliate relationships help fund the platform, but they do not determine whether a selection is marked PLAY, AVOID, or WAIT. Decision states are based on betting intelligence, price quality, and risk factors. Betting involves risk, and DOCTORE does not guarantee profit or outcomes.

## Where disclosure is required

Disclosure is required near:

- sportsbook CTA buttons
- odds comparison tables
- match preview affiliate links
- daily board partner links
- email sportsbook links
- Telegram sportsbook links
- partner comparison pages

## Affiliate link placement

Preferred placement:

```txt
[View available sportsbook]

Affiliate link. DOCTORE may earn commission. This does not affect the decision state.
```

## AVOID card rules

AVOID cards should not aggressively push sportsbook CTAs.

Preferred CTA:

> View explanation

If a sportsbook link is shown on an AVOID card, add:

> This selection is marked AVOID. If you choose to bet anyway, betting involves risk.

## WAIT card rules

WAIT cards should usually prioritize alerts over sportsbook links.

Preferred CTA:

> Set alert

Affiliate disclosure is required only if a sportsbook link is shown.

## PLAY card rules

PLAY cards may include sportsbook CTA placement when appropriate.

Required context:

- decision reason
- risk note
- affiliate disclosure
- no-guarantee language

## Internal data separation

Decision data may include:

- decision state
- market
- selection
- best odds
- confidence score
- risk rating
- explanation
- market context
- decision timestamp

Affiliate data may include:

- bookmaker id
- bookmaker name
- affiliate URL
- tracking code
- jurisdiction availability
- disclosure requirement
- commercial priority metadata

Commercial priority metadata must not be consumed by decision logic.

## Forbidden behavior

Never allow:

- affiliate payout to change decision state
- sportsbook partner to override odds quality
- commercial relationship to suppress AVOID labels
- commercial relationship to increase confidence score
- affiliate link presence to affect risk rating
- partner ordering to misrepresent best available odds

## Reporting principle

Affiliate reporting should measure performance without changing editorial or decision logic.

Recommended metrics:

- clicks by card state
- clicks by page type
- conversion by source
- disclosure visibility
- sportsbook CTA engagement
- Free to Plus conversion after affiliate click
- partner clicks by sport and market

## Trust statement

DOCTORE should use transparency as a selling point:

> Decision integrity comes first. Affiliate links fund the platform, but they do not decide what is marked PLAY, WAIT, or AVOID.
