# Fitts/throughput and BCI cursor-control references

## Retrieval snapshot
- Date retrieved: 2026-06-27

## Core HCI and information-theoretic references
- Fitts law overview and Shannon-form discussion: https://en.wikipedia.org/wiki/Fitts%27s_law (retrieved 2026-06-27).  
  - Useful for:
    - ID formulation lineage (`log2(2A/W)` and `log2(A/W + 1)` variants)
    - Relationship of Index of Performance to throughput units (bits/sec).
- Open-access treatment of Fitts model variants and ID consistency: https://pmc.ncbi.nlm.nih.gov/articles/PMC3203862/
- UK/European usability text and examples of the throughput/ID relationship: https://pmc.ncbi.nlm.nih.gov/articles/PMC5770750/
- Information-theoretic framing notes: https://www.yorku.ca/mack/JMB89.html
- General throughput and BPS terminology (for HCI comparison context): https://en.wikipedia.org/wiki/Throughput_(human-computer_interaction) (retrieved 2026-06-27)

## BCI cursor-control / neurotechnology references
- Fitts-style cursor metric in BCI context: https://pmc.ncbi.nlm.nih.gov/articles/PMC5371026/
- iBCI cursor-control study using modified Fitts law assessment with Fitts bits/s metrics: https://pmc.ncbi.nlm.nih.gov/articles/PMC4075430/
- High-performance intracortical BMI reference point (upper-bound comparison context): https://www.nature.com/articles/nature04968
- Noninvasive/assistive movement-control papers using throughput metrics (as contextual priors):
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC8197934/
  - https://www.mdpi.com/1424-8220/20/24/7162

## Neuralink-specific evidence
- Primary product page (game context and scoring prose): https://neuralink.com/webgrid/
- Direct bundle evidence: https://neuralink.com/assets/entries/pages_webgrid.page.CppXssKR.js
  - Confirmed factor inside JS: `log2(t*t-1)*NTPM/60`, clamped at zero.
  - Confirmed miss/correct semantics and rolling 60-second scoring window.

## Verified vs inferred
- Verified from code inspection:
  - NTPM definition as net-trial difference over 60-second window.
  - BPS conversion from NTPM with `log2(gridSize^2 - 1)`.
  - Non-repeating target transition after correct trial.
- Inferred from general literature:
  - How this compares to classic Fitts throughput normalization for A/W tasks and standard HCI ID definitions.
  - Whether anti-cheat and backend persistence safeguards in Neuralink's production stack mirror Webgrid+ semantics.
