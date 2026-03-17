# Estimated Revenue Calculation

This document explains how estimated revenue, costs, and estimated profit are calculated for production preview.

Source: `src/store/gameStore.js` (`calculateProductionOutcome`, `applyProfitabilityModifierToOutcome`, `previewProduction`)

## Base Revenue and Cost Formula

After grade is computed, financials are calculated as follows:

1. Total model popularity:

`totalModelPopularity = sum(model.popularity)`

2. Gross revenue:

`grossRevenue = max(0, round(totalModelPopularity * (companyReputation + grade)))`

3. Model payout:

`modelPayoutTotal = round(grossRevenue * 0.2)`

4. Service cost:

`serviceCost = service.costPerStaff * selectedStaff.length`

5. Location cost:

`locationCost = location.extraCost`

6. Dress partner cost:

`dressCost = dress.sponsorshipCost`

7. Operating cost:

`operatingCost = modelPayoutTotal + serviceCost + locationCost + dressCost`

8. Estimated profit:

`estimatedProfit = grossRevenue - operatingCost`

## Profitability Modifier Layer

A profitability modifier may be applied after base calculation:

`adjustedGrossRevenue = round(grossRevenue * (1 + modifierPercent / 100))`

Then model payout and operating cost are recalculated using adjusted gross revenue.

Current implementation note:
- `keywordModifierPercent(...)` returns `0`
- `previousTitleFameModifierPercent(...)` returns `0`
- So `modifierPercent` is currently `0` unless those functions are implemented later.

## Freelance Contract Effect

If a freelance contract is selected and all requirements pass:

`estimatedTotalProfit = estimatedProfit + freelancePayout`

Where:
- `freelancePayout = selectedGig.agreedPayment`

## Preview Output Fields

`previewProduction` returns:
- `grossRevenue`
- `operatingCost`
- `estimatedProfit`
- `freelancePayout`
- `estimatedTotalProfit`
- `profitabilityModifierPercent`
- `keywordBonusPercent`
- `fameBonusPercent`

## Validation Checks Before Estimate Is Accepted

Estimate is blocked if any of these fail:
- Invalid model count
- Expired or unpaid model contract
- Invalid/locked shoot setup
- Low model stamina for selected shoot type
- Invalid staff selection (including unpaid or expired staff contracts)
- Missing description/location/service/dress/equipment
- No camera selected
- AP (Action Points) insufficient for selected shoot type
- Freelance requirement mismatch
