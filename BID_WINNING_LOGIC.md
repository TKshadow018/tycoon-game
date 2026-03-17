# Bid Winning Logic

## Definitions
- `budget` = `gig.suggestedBudget`
- `relation` = current relation with the target company
- `bid` = player's bid amount

## Reject Factor By Relation
- `relation < 20` => `rejectFactor = 1.1`
- `relation < 35` => `rejectFactor = 1.25`
- `relation < 50` => `rejectFactor = 1.5`
- `relation < 75` => `rejectFactor = 1.75`
- `relation < 90` => `rejectFactor = 2`
- `relation >= 90` => `rejectFactor = 2`

## Rule Order (Applied In This Exact Order)
1. Hard reject:
- Reject immediately if `bid > budget * rejectFactor`.

2. If `budget < bid < budget * rejectFactor`:
- `relation < 50` => `25%` win chance
- `relation >= 50` => `50%` win chance

3. Otherwise (`bid <= budget`):
- `relation < 50` => dynamic win chance:
	- Base is `50%` when `bid == budget`.
	- For each `1%` lower than budget, add `+2%` win chance.
	- Formula: `winChance = clamp(50 + (discountPercent * 2), 0, 100)` where `discountPercent = ((budget - bid) / budget) * 100`.
- `relation >= 50` => `100%` win chance

## Notes
- The `budget < bid` broad rule is refined by the narrower `budget < bid < budget * rejectFactor` rule.
- Relation boundary handling in code uses `relation >= 50` for the higher-trust branch.
- On accepted bid, a freelance contract is created as before.
