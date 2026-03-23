import type { EditorialArticle } from '@/types/article'

export const seedArticles: EditorialArticle[] = [
  /* ── 001 · FEATURE ─────────────────────────────────────────────── */
  {
    articleId: 'article-001-dressing-the-dry-season',
    slug: 'dressing-the-dry-season',
    category: 'Trends',
    headline: 'Dressing the Dry Season',
    teaser:
      'How Kenyan designers are reclaiming arid-earth palettes — ochre, bone, and rust — as the defining aesthetic of AW 2026.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Wide-leg trousers in earth tones against red Kenyan laterite soil',
    readingTimeMin: 5,
    publishedAt: '2026-03-10T08:00:00Z',
    author: 'Kefilwe Nkosi',
    isFeature: true,
    relatedLooks: ['arid-geometry', 'red-laterite', 'ochre-stance'],
    forkCount: 4,
    revisionHistory: [
      {
        hash: 'a3f7e2c',
        version: 'v1.0',
        date: '2026-03-10T08:00:00Z',
        message: 'Initial publication — three looks, two locations',
        author: 'Kefilwe Nkosi',
      },
      {
        hash: 'b1c9d4f',
        version: 'v1.1',
        date: '2026-03-14T14:30:00Z',
        message: 'Added Ochre Stance reference and Karen location notes',
        author: 'Kefilwe Nkosi',
      },
      {
        hash: 'e7a8201',
        version: 'v1.2',
        date: '2026-03-20T09:15:00Z',
        message: 'Expanded iron-oxide dyeing section with Machakos sourcing detail',
        author: 'Grace Otieno',
      },
    ],
    body: `The Kenyan dry season arrives without announcement. One morning the red dust is moving differently — not lifted, but rolling — and you understand that the rains are gone for another four months.

Dress for this. Not against it.

## The Palette Is the Argument

AW 2026 in Nairobi is being built from the ground up. Literally. Iron-rich laterite from Machakos, ochre from the walls of Karen compounds, the bone-dry grey of lakeshore mud at Magadi — these are not borrowed colours. They are site-specific, ungeneralised, and impossible to approximate in a European studio.

The Red Laterite look begins there: raw cotton grown in Machakos, dyed with iron oxide extracted from the same soil the fabric references. The colour is not burnt sienna. It is not Venetian red. It resists translation because it was never meant to travel.

## Structure in the Heat

Wide-leg silhouettes dominate because they make sense. Volume at the base creates a microclimate. The heat is acknowledged and redirected, not fought. Wanjiku Mwangi's Arid Geometry coat does the opposite — it argues against comfort with structured charcoal wool — but this is a deliberate counterpoint. Every collection needs one refusal.

The Ochre Stance coat is the third point of the triangle. Double-breasted, wide peak lapel, brushed merino. It is designed to last forty years. It photographs at dusk and it reads at noon and it does neither apologetically.

## What the Dry Season Teaches

Colour that survives this light has earned its right to exist. The designers building AW 2026 from Kenyan earth are not making a statement about origin — they are making garments that make sense in the latitude where they were conceived.

That is the only argument that matters.`,
  },

  /* ── 002 ────────────────────────────────────────────────────────── */
  {
    articleId: 'article-002-hand-canvas',
    slug: 'the-hand-canvas-argument',
    category: 'Process',
    headline: 'The Hand-Canvas Argument',
    teaser:
      'In an era of fused interlinings, Wanjiku Mwangi spends three days padstitching a single lapel. Here is why.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Close-up of hand-padstitching on a charcoal wool lapel',
    readingTimeMin: 7,
    publishedAt: '2026-03-14T08:00:00Z',
    author: 'Wanjiku Mwangi',
    relatedLooks: ['arid-geometry', 'copper-declension', 'ochre-stance'],
    forkCount: 2,
    revisionHistory: [
      {
        hash: 'c2d5f18',
        version: 'v1.0',
        date: '2026-03-14T08:00:00Z',
        message: 'Initial publication — hand-canvas process documentation',
        author: 'Wanjiku Mwangi',
      },
      {
        hash: 'f4e3b90',
        version: 'v1.1',
        date: '2026-03-19T11:00:00Z',
        message: 'Added technical spec cross-references for Copper Declension',
        author: 'Wanjiku Mwangi',
      },
    ],
    body: `A fused interlining takes forty-five seconds to apply. A hand-padstitched canvas takes three days. The difference is not visible to anyone who does not know what to look for — and for thirty years, the fashion industry has been betting that nobody looks.

This is beginning to be an incorrect assumption.

## What the Canvas Does

The floating canvas inside a bespoke coat chest piece does three things: it supports the fabric's drape, it breathes with the body's movement, and it moulds — slowly, over months of wearing — to the specific topography of the person inside it.

A fused interlining does one of these things and it does it perfectly for approximately two years, after which the bond between layers begins to fail. The fabric bubbles. The front of the coat develops a geography of its own that has nothing to do with the body wearing it.

## The Arid Geometry Lapel

The Arid Geometry coat took sixty-two hours to build. The padstitching on each lapel — 8 stitches per centimetre, worked in a diagonal grid across the entire canvas surface — took eleven of those hours. You will never see this work. The lapel rolls and holds its position because of it.

The Copper Declension blazer is the same construction philosophy applied to a different problem. Warp-faced metallic twill does not forgive cutting errors. The full floating canvas chest piece gives the fabricator control over the fall of the front, something that would be impossible with a fused interlining in a fabric this directional.

## The Ochre Argument

The Ochre Stance coat at 78 construction hours is the most labour-intensive piece in AW 2026. Double-breasted, peak lapel, hand-padstitched throughout. It is also the piece most likely to be worn in forty years. The two facts are not unrelated.

The hand-canvas argument is ultimately an argument about time. Not the time it takes to make — the time the garment will last.`,
  },

  /* ── 003 ────────────────────────────────────────────────────────── */
  {
    articleId: 'article-003-molo-wool',
    slug: 'molo-wool-the-kenyan-fibre',
    category: 'Material',
    headline: 'Molo Wool: The Kenyan Fibre the World Keeps Ignoring',
    teaser:
      'Nakuru County produces highland wool at altitude that rivals New Zealand merino. Why does it never leave the continent?',
    coverImageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Detail of heavy wool texture under raking light',
    readingTimeMin: 6,
    publishedAt: '2026-03-17T08:00:00Z',
    author: 'Amara Osei',
    relatedLooks: ['arid-geometry', 'ochre-stance'],
    forkCount: 3,
    revisionHistory: [
      {
        hash: '9b3a7d2',
        version: 'v1.0',
        date: '2026-03-17T08:00:00Z',
        message: 'Initial publication — Molo highland wool sourcing and fibre analysis',
        author: 'Amara Osei',
      },
      {
        hash: '1e6c4f9',
        version: 'v1.1',
        date: '2026-03-22T16:00:00Z',
        message: 'Corrected altitude figure for Molo plateau; added Arid Geometry spec link',
        author: 'Wanjiku Mwangi',
      },
    ],
    body: `At 2,300 metres above sea level, the Molo plateau in Nakuru County produces wool that should be famous. The altitude, the grazing, the temperature differential between highland days and highland nights — these are conditions that produce fibre with character.

Instead, most Molo wool is exported as raw greasy fleece to South Africa or blended into low-grade blanket fabric for the domestic market. The KESTRA AW 2026 collection is built, in part, on the argument that this should change.

## The Fibre

Molo wool averages 24–26 microns. This is not superfine — Merino Extra Fine runs at 15–18 microns — but it is substantive. It has a natural crimp that gives structure without synthetic support. It felts cleanly and it holds dye with a depth that synthetic blends cannot replicate.

The Arid Geometry shell fabric is 100% Molo virgin wool at 380 GSM. It holds its silhouette without interlining because the fibre has enough natural body. The coat's geometry — flat planes, hard shadows — is possible because of what the wool does, not despite it.

## Why It Stays Here

The answer is infrastructure. Clean washing, combing, and spinning facilities at scale do not exist in Nakuru County. The raw fibre travels to South Africa or further before it is processable into cloth, adding cost and removing traceability. By the time it returns as fabric, its Kenyan origin has been laundered out of the supply chain.

The Ochre Stance coat's brushed merino tweed — sourced from Ireland because the equivalent Kenyan fabric does not yet exist in commercial quantities — is the honest acknowledgement of this gap.

## The Next Step

The AW 2026 collection is not a solution to this problem. It is a documentation of it. The Arid Geometry coat exists as evidence that Molo wool at 380 GSM, hand-constructed, produces a garment of serious quality. The argument is in the fabric.`,
  },

  /* ── 004 ────────────────────────────────────────────────────────── */
  {
    articleId: 'article-004-swahili-coast-indigo',
    slug: 'swahili-coast-indigo',
    category: 'Culture',
    headline: 'Indigo Came by Dhow',
    teaser:
      'The Swahili Coast has been a dyestuff crossroads for a thousand years. Natural indigo fermented in Lamu pots still produces a blue no synthetic can replicate.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Deep indigo-dyed fabric hanging to dry in the Mombasa old town',
    readingTimeMin: 8,
    publishedAt: '2026-03-20T08:00:00Z',
    author: 'Seun Adeyemi',
    relatedLooks: ['indigo-latitude'],
    forkCount: 5,
    revisionHistory: [
      {
        hash: '3d8f1a6',
        version: 'v1.0',
        date: '2026-03-20T08:00:00Z',
        message: 'Initial publication — Lamu indigo process and Swahili Coast history',
        author: 'Seun Adeyemi',
      },
      {
        hash: '7c2e5b4',
        version: 'v1.1',
        date: '2026-03-24T10:45:00Z',
        message: 'Added Indigo Latitude fermentation documentation (11-day vat)',
        author: 'Grace Otieno',
      },
      {
        hash: 'a9f0d3c',
        version: 'v1.2',
        date: '2026-03-28T15:20:00Z',
        message: 'Expanded trade route section with Portuguese disruption context',
        author: 'Seun Adeyemi',
      },
    ],
    body: `Before the Portuguese arrived and disrupted everything, the Swahili Coast was the most sophisticated trading network in the Indian Ocean. Cloth, spice, gold, ivory — and dye. Indigo arrived by dhow from Gujarat, from Persia, from the interior of the subcontinent, and it stayed.

The Indigo Latitude jacket is dyed with natural indigo fermented in a Lamu pot for eleven days before the first dip. Grace Otieno oversaw three immersions with twenty-four-hour drying intervals between each. The colour that resulted is not a colour you can specify in a Pantone book.

## The Vat

Natural indigo dyeing requires a fermentation vat — a reducing environment in which the indigo molecule is converted to its soluble leuco form, capable of bonding with cellulose fibre. The Lamu dyers who taught Grace use a combination of natural alkali (wood ash lye) and organic reducing agents (dates, bran, local plant material) that have been refined over generations.

The chemistry is the same as industrial synthetic indigo dyeing. The result is not. Synthetic indigo dyes in single-colour layers. Natural indigo builds up in irregular micro-deposits that scatter light differently at the surface, creating the depth — the sense that the colour continues behind the surface — that characterises traditional Swahili indigo cloth.

## The Blue No Synthetic Can Replicate

The Indigo Latitude jacket will fade. Natural indigo begins to oxidise and release from the fibre with washing and UV exposure. The fade is not a defect — it is the continuation of the garment's life. The worn areas, the collar, the cuffs, the pocket edges — will lighten first, creating a topography of use that synthetic dyeing cannot produce because it has no depth to reveal.

This is what the dhow carried. This is what stayed.`,
  },

  /* ── 005 ────────────────────────────────────────────────────────── */
  {
    articleId: 'article-005-bias-cut-returns',
    slug: 'the-bias-cut-returns',
    category: 'Trends',
    headline: 'The Bias Cut Is Back — and It Belongs in the Rift Valley',
    teaser:
      'The fluid, gravity-driven silhouette last dominated in the 1930s. A new generation of East African designers is reclaiming it for 2026.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Bias-cut white linen dress in movement against a Rift Valley backdrop',
    readingTimeMin: 4,
    publishedAt: '2026-03-23T08:00:00Z',
    author: 'Kefilwe Nkosi',
    relatedLooks: ['salt-plain', 'night-latitude'],
    forkCount: 2,
    revisionHistory: [
      {
        hash: '5f1b8e3',
        version: 'v1.0',
        date: '2026-03-23T08:00:00Z',
        message: 'Initial publication — bias cut in SS and Resort 2026',
        author: 'Kefilwe Nkosi',
      },
    ],
    body: `The bias cut is a structural argument, not a fashion one. Cut fabric at 45 degrees to the grain and it does something cloth cut on the straight grain cannot: it moves. Not drapes — moves. The weave opens to gravity, closes with the body, finds its own fall.

Madeleine Vionnet understood this in the 1930s. So did Halston in the 1970s. The difference in 2026 is the climate. The Rift Valley at noon is a different problem than Paris in spring.

## Salt Plain: Linen in Extremis

The Salt Plain dress is cut from Belgian linen, pre-washed four times before pattern placement. At Lake Magadi, in harsh midday Rift Valley light, the bias cut does the only sensible thing: it breathes. The single seam running from right shoulder to left hip is on the bias — it is the only seam that moves in a crosswind.

Wanjiku Mwangi's rule for this dress: cut and hem must be separated by at least 24 hours. The bias-cut panels will drop and shift. Cutting and hemming on the same day produces an uneven hem. The Rift Valley itself enforces patience.

## Night Latitude: Silk at the Equator

The Night Latitude slip dress takes the same principle further. Washed silk charmeuse at 75 GSM, cut entirely on the bias — no darts, no princess seams, only the fabric's relationship with gravity as a shaping tool. At one degree south of the equator, where the equatorial night is not dark but saturated, this is appropriate.

The architectural back strap — crossing at the mid-spine — is the one structural decision that resists the bias. Everything else is the absence of intervention.

## Why Here, Why Now

The bias cut flourishes in latitudes that take heat seriously. East Africa in 2026 is one of those latitudes. The designers building from this geography are not reviving a trend — they are solving a problem the trend originally solved for a different set of conditions, and finding it applies here too.`,
  },

  /* ── 006 ────────────────────────────────────────────────────────── */
  {
    articleId: 'article-006-interview-grace-otieno',
    slug: 'grace-otieno-on-flat-felled-seams',
    category: 'Interview',
    headline: '"A flat-felled seam will outlast the person wearing it"',
    teaser:
      'Tailor Grace Otieno on twenty years in Nairobi\'s garment district, the extinction of hand-finishing, and why she only uses French seams for silk.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Portrait of tailor Grace Otieno in her Gikomba workshop',
    readingTimeMin: 9,
    publishedAt: '2026-03-25T08:00:00Z',
    author: 'Amara Osei',
    relatedLooks: ['red-laterite', 'indigo-latitude', 'sisal-bone'],
    forkCount: 1,
    revisionHistory: [
      {
        hash: '2a9c6d7',
        version: 'v1.0',
        date: '2026-03-25T08:00:00Z',
        message: 'Initial publication — interview transcript, lightly edited',
        author: 'Amara Osei',
      },
      {
        hash: '8e4f0b2',
        version: 'v1.1',
        date: '2026-03-27T09:30:00Z',
        message: 'Added construction notes for Sisal & Bone at Grace\'s request',
        author: 'Grace Otieno',
      },
    ],
    body: `Grace Otieno has been cutting in Gikomba for twenty-three years. Her workshop — two sewing machines, one iron, a cutting table large enough for a double-width fabric fold — is recognisable by the sound of it: no music, just the industrial rhythm of a Juki running flat-felled seams at 6am.

She agreed to talk while she worked.

## On seam construction

You want to know why I use flat-felled seams on the Red Laterite trousers? Because the fabric is raw cotton dyed with iron oxide. It will be washed repeatedly. A French seam on raw cotton that has been iron-oxide dyed is a seam that will open at the third wash. A flat-felled seam will outlast the person wearing it.

I use French seams for silk. The Night Latitude dress — that charmeuse — needs French seams because charmeuse frays and the seam allowance needs to be enclosed. Flat-felled is too thick for silk at 75 GSM. You have to read the fabric.

## On hand-finishing

Nobody teaches hand-finishing any more. The schools are teaching people to use sergers. A serger makes a clean edge but it does not make a strong seam on bias-cut fabric. The Sisal & Bone suit — unlined, so everything is visible on the inside — has 3-thread overlock on the blazer and flat-felled on the trouser. You choose the seam based on what the inside of the garment is going to do over ten years, not based on what is fastest.

## On the Indigo Latitude jacket

The unlined jacket for Indigo Latitude — all internal seams finished with Hong Kong binding in matching fabric. This took longer than lining it would have taken. But an unlined jacket in natural indigo-dyed cotton needs to breathe. A lining would trap the dye residue against the body in the first few washes.

Everything is a system. The dye tells you what the seam should be. The seam tells you what the interlining should be. You read backward from wear and forward from fibre.

## On twenty years

I have made the same mistakes twice. Three times. And then I stopped making them. That is what twenty years gives you — not mastery, but the catalogue of errors you have stopped repeating.`,
  },

  /* ── 007 ────────────────────────────────────────────────────────── */
  {
    articleId: 'article-007-field-notes-karen',
    slug: 'field-notes-karen-shoot',
    category: 'Field Notes',
    headline: 'Field Notes: The Karen Shoot',
    teaser:
      'Photographer Amara Osei on shooting at golden hour in a Karen compound — the light, the walls, and why the ochre plaster is the real subject.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=1400&q=90&auto=format&fit=crop',
    coverImageAlt: 'Behind-the-scenes shot during the Arid Geometry editorial in Karen',
    readingTimeMin: 3,
    publishedAt: '2026-03-28T08:00:00Z',
    author: 'Amara Osei',
    relatedLooks: ['arid-geometry', 'ochre-stance'],
    forkCount: 0,
    revisionHistory: [
      {
        hash: '6d0e2f8',
        version: 'v1.0',
        date: '2026-03-28T08:00:00Z',
        message: 'Initial field notes — shot log from Karen compound, 22 March 2026',
        author: 'Amara Osei',
      },
    ],
    body: `Shot log: Karen compound, 22 March 2026. AW 2026 editorial — Arid Geometry and Ochre Stance.

## 05:47

Arrived before the light. The walls face east. This is what we came for: the first forty minutes of direct sun on ochre plaster creates a warmth that cannot be replicated at any other time of day. The colour of the wall at 6am is not the colour of the wall at 8am.

Set up in the northwest corner of the compound where the shadow line from the acacia tree cuts the frame diagonally. This is the compositional anchor.

## 06:15 — Arid Geometry

First look: the charcoal coat against the ochre wall. The relationship between these two colours is the editorial argument. Charcoal and ochre are not complementary — they argue. The coat belongs to shade, the wall to light. The model occupies the threshold between them.

The collar stands independently. It reads in the frame as a third architectural element: wall, coat, collar. The decision to shoot at f/2.8 blurs the compound behind the look, reducing it to a wash of warm colour.

## 07:30 — Ochre Stance

The double-breasted coat in golden hour. This was what the whole session was scheduled around. The brushed merino tweed at this light does something I have not seen other fabric do: it absorbs and re-emits. The surface does not reflect — it holds.

We shot 340 frames in 25 minutes. 6 are usable. 1 is the edit.

## 08:05

Light is gone. The wall has turned ordinary. Pack down.

The Karen shoot is the easiest kind of editorial to make: the location does most of the work. The difficulty is getting there early enough to deserve it.`,
  },
]
