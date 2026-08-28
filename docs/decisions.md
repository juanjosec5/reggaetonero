# Decision content — breakdown

Reference for the event catalog (`src/data/events/*.ts`, aggregated by
`src/data/events/index.ts`). The code is the source of truth; this is the map.

## Shape of a career

- Fixed **21 years**, age 20 → 40. Roughly one event per year, so a playthrough
  is **~15–20 decisions** (some years roll nothing; a matured delayed effect
  pre-empts a fresh roll — see `eventEngine.selectYearEvent`).
- **75 events**: 17 `oncePerCareer`, 10 follow-up-only (`condition: () => false`,
  reached only through a `pendingEffect`), ~48 repeatable. Several repeatables are
  practically once-ish because they gate on team/label state the event itself
  flips (`mgmt_hire_*`, `label_major_three_album_deal`, …).

## 1. Critical moments — the decisions that define a career

`oncePerCareer` pivots plus the ownership axis:

| id | when | the choice |
|---|---|---|
| `music_first_studio_session` | year ≤ 2 | where you cut your first real record |
| `music_first_show` | year ≤ 4 | your first stage |
| `money_day_job` | year ≤ 3, low fame | quit the job and go all-in, or hedge |
| `mgmt_first_manager` | hype ≥ 15 | sign a manager or stay solo |
| `label_major_three_album_deal` | hype ≥ 25, unsigned | **money vs. masters** — sign / negotiate / stay independent |
| `label_masters_buyback` | ownership < 80, cash ≥ 100 | buy your catalogue back |
| `biz_launch_own_brand` | fame ≥ 35, year ≥ 5 | build a business off your name |
| `biz_catalog_sale_offer` | year ≥ 10, catalogValue ≥ 120 | sell the whole catalogue for a cheque |
| `comp_awards_win` | fame ≥ 45, hits ≥ 3 | the big award — dedicate it, or send a message |
| `tour_stadium_commitment` | fame ≥ 48 | stadiums, all-or-nothing, or the safe route |
| `media_documentary_offer` | year ≥ 4, fame ≥ 20 | open your life up |
| `biz_greatest_hits` | age ≥ 34 | cash-in compilation, or fight for one more real album |
| `media_career_retrospective` | age ≥ 34 | where the magazine ranked you |
| `music_veteran_reinvention` | age ≥ 33, cooling off | reinvent, double down, or accept the veteran role |
| Pure disasters (`oncePerCareer`): `setback_manager_embezzlement`, `setback_tax_debt`, `setback_vocal_injury`, `health_collapse` |

## 2. Delayed-effect chains — a choice now, a consequence in 1–3 years

Almost always the *ambitious / creative / risk-taking* option plants the seed;
the *safe* alternative resolves immediately.

| trigger (choice) | → follow-up | offset |
|---|---|---|
| `biz_launch_own_brand` (invest big) | `biz_brand_returns` | +2y |
| `biz_crypto_pitch` (accept) | `biz_endorsement_blowup` | +2y |
| `controversy_leaked_demo` (go public) | `controversy_feud_escalation` | +1y |
| `health_studio_exhaustion` (push through) | `health_collapse` | +2y |
| `tour_burnout_on_road` (finish the tour) | `health_collapse` | +1y |
| `health_party_lifestyle` (let go) | `health_wakeup_call` | +3y |
| `label_major_three_album_deal` (negotiate) | `label_negotiation_backlash` | +2y |
| `mgmt_manager_conflict` (fire them) | `mgmt_first_manager` again | +1y |
| `rel_producer_credit_dispute` (deny it) | `rel_producer_goes_public` | +1y |
| `setback_label_shelves_album` (leak it) | `setback_label_lawsuit` | +1y |
| `setback_tax_debt` (payment plan) | `setback_tax_debt_followup` | +2y |
| `tour_arena_upgrade` (announce arenas) | `tour_ticket_sales_report` | +1y |

## 3. Genuine gambles — outcome straddles zero on a key resource

`money_advisor_pitch` (invest — a coin-flip on cash) · `biz_brand_returns` ·
`tour_arena_upgrade` / `tour_ticket_sales_report` · `tour_break_new_market` ·
`music_concept_album` (conceptual) · `music_veteran_reinvention` (reinvent —
±hype) · `setback_flop_streak` (insist) · `comp_awards_win` (send a message) ·
`comp_new_wave_threat` (double down).

## 4. Pure setbacks — both options are damage control

The `setbacks.ts` set, plus the follow-up-only `health_collapse`,
`health_wakeup_call`, `rel_producer_goes_public`, `biz_endorsement_blowup`.
"The question is only which way you take the hit, never whether."

## 5. Routine / flavor — the texture between the pivots

Most of `music`, `media`, `collaboration`, `money`, the hire events,
`comp_rival_subtweet`, `rel_barrio_crew`, `rel_next_gen_cosign`,
`media_local_radio`. Small stat nudges that steer the derived identity through
their `style`.

## 6. Events that move the era-table columns directly

Most of the table (tickets, shows, awards, platinum) is derived yearly in
`recordEngine` from stats — choices influence it *indirectly*. These touch the
counters head-on:

- `tour_stadium_commitment` → `record.stadiumShows` / `clubShows` / `ticketsSold`
- `music_platinum_push` → `{ kind: 'award', award: 'platinum' }`
- `comp_awards_win` → `{ kind: 'award', award: 'grammy' | 'billboard' }`

## 7. Coverage by career stage

| stage | ages | density |
|---|---|---|
| **debut** (yr 1–4) | 20–23 | `music_first_studio_session`, `music_first_show`, `money_day_job`, `rel_barrio_crew`, `media_local_radio`, `collab_producer_partnership`, plus hype-gated ones as you rise |
| **ascenso** (yr 5–8) | 24–27 | the bulk — label, management, first tours, collabs, media |
| **cima** (yr 9–12) | 28–31 | awards, big tours, brand, catalogue, rivalries |
| **veterano** (yr 13–16) | 32–35 | `music_veteran_reinvention`, `rel_next_gen_cosign`, `comp_new_wave_threat`, `setback_vocal_injury`, tax/health setbacks |
| **leyenda** (yr 17–21) | 36–40 | `biz_greatest_hits`, `media_career_retrospective`, `biz_catalog_sale_offer`, retrospective setbacks |

## Known gaps / follow-ups

- The `record.hits` gate (a "hit" is a release scoring ≥ 75) is stiff — several
  late-game events want `hits ≥ 3`, which is rare under non-optimised play.
  Either loosen those gates or make hit tiers more attainable.
- `livePower` and `industryRespect` grow slowly; tour/industry-gated content
  (`tour_stadium_commitment`, `rel_next_gen_cosign`) needs a player to lean in.
- Rivalry content is thin past the early beefs — no sustained rival storyline
  (that's the Phase 4 "active rival storylines" item).
