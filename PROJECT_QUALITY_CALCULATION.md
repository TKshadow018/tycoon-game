# Project Quality Calculation

This document explains how project quality (video grade) is calculated in the current game logic.

Source: `src/store/gameStore.js` (`calculateProductionOutcome`)

## Formula Overview

Quality is computed as:

`videoQualityRaw = modelQualityScore + staffSkillScore + locationScore + equipmentScore + nameScore + reputationScore`

Then final grade is:

`grade = clamp(round(videoQualityRaw), 0, 100)`

## Component Breakdown

1. `modelQualityScore`
- For each selected model: `(model.quality * 5) / 100`
- Sum for all selected models.

2. `staffSkillScore`
- For each selected staff (including owner if used): `(staff.skill * 5) / 100`
- Sum for all selected staff categories.

3. `locationScore`
- Uses selected location bonus directly:
- `location.qualityBonus || 0`

4. `equipmentScore`
- Sum all selected equipment quality bonuses.
- Capped at 10:
- `equipmentScore = min(10, totalEquipmentQualityBonus)`

5. `nameScore`
- Derived from shoot title keywords through `getNameQualityBonus(shootName)`.
- Current keyword behavior:
- High keywords: `+10`
- Medium keywords: `+5`
- Low keywords: `+2`
- Otherwise: `0`

6. `reputationScore`
- Based on company reputation:
- `reputationScore = companyReputation / 10`

## Notes

- Grade is always between 0 and 100 due to `clamp`.
- Model stamina and contract checks happen before quality calculation; if invalid, project cannot start.
- Equipment is mandatory and must include at least one camera.
