# Studio Tycoon - Pattern A Game Reference

**Last Updated:** May 2026  
**Version:** Pattern A (Base UI)  
**Purpose:** Complete functionality reference for future development and feature tracking

---

## Table of Contents

1. [Game Overview](#game-overview)
2. [Core Game Screens](#core-game-screens)
3. [Game Mechanics & Features](#game-mechanics--features)
4. [UI Components & Sections](#ui-components--sections)
5. [Modals & Dialogs](#modals--dialogs)
6. [Data Management & Store](#data-management--store)
7. [Customization Systems](#customization-systems)
8. [File Structure](#file-structure)

---

## Game Overview

**Studio Tycoon** is a business simulation game where players build and manage a media production studio from scratch.

### Core Premise
- Start with **zero resources**: no studio, no staff, no models
- **Popularity starts at 0**, reputation starts at neutral
- **Daily progression system**: Each "day" represents a game cycle with end-of-day triggers
- **Revenue generation** through multiple channels and content sales
- **Relationship-based mechanics** with production companies and freelance opportunities

### Key Metrics
- **Budget/Money**: Primary resource for hiring, equipment, and studio rental/purchase
- **Day Counter**: Tracks progression; ends trigger contract renewals, gig refreshes, interviews
- **Popularity**: Affects work quality, casting appeal, and mission unlocking
- **Reputation**: Impacts company relations and gig opportunities
- **Action Points (AP)**: Limited resource for secondary actions (training, parties, website management)
- **Stamina**: Affects models/staff performance and recovery

---

## Core Game Screens

### 1. Start Screen (Pre-Game)

**Location:** Shown when `started === false`

**Features:**
- **Hero Image**: Splash image showcasing studio theme
- **Company Setup Form**:
  - Company Name input (required)
  - Initial Budget selector (default: $25,000; minimum: $5,000)
  - UI Theme selector (Neumorphism, Glassmorphism, Claymorphism)
  - Theme selection persists to `localStorage` as `ui-theme`
- **Quick Links**:
  - **Model Creator** (`/model-creator`) - Access 130 pre-generated models with customizable attributes
  - **Staff Creator** (`/staff-creator`) - Edit 50 staff members' skills and calculated fees
- **Preview Images**: 3 sample images showcasing game atmosphere

**Transitions:**
- Clicking "Start Game" calls `startGame(companyName, initialBudget)` from game store
- On success, `started` state becomes `true` → routes to main game view
- On error, displays notification with failure reason

---

### 2. Main Game View - Desktop

**Activated when:** `started === true` && `!isMobile` (viewport width ≥ 900px)

**Component:** `DesktopGameView.jsx`

**Layout Structure:**
```
┌─ Hero Header (Top Bar) ─────────────────┐
│ Company Name | Studio | Staff | Models  │
│ [End Day] [Save Game] [Slot Selector]   │
│ Day | Budget | Popularity | Reputation  │
│ Action Points (AP)                      │
├─ Left Sidebar ──┬─ Center Column ──┬─ Right Sidebar ┐
│                 │                  │                │
│ Left Tabs:      │ Production Panel │ Freelance Gigs │
│ • Staff         │ [Start Project]  │ • Daily Ops    │
│ • Studio        │ • Theme Switch   │ • Contracts    │
│ • Equipment     │ • Actions Grid   │                │
│                 │ • Inventory      │                │
│ Staff List      │ • Item List      │ Bid Interface  │
│ Models List     │ • Filter/Sort    │                │
│ Equipment List  │ • Sales Options  │                │
└─────────────────┴──────────────────┴────────────────┘
```

**Key Sections:**

#### Hero Header
- **Company Banner** (customizable via production modal)
- **Quick Stats**: Day, Budget, Popularity, Reputation, AP
- **End Day Button**: Advances game state, triggers end-of-day logic
- **Save/Load System**:
  - 5+ save slots
  - Save slot dropdown with metadata (company name, day, budget)
  - Load button to restore saved state
  - Saves to browser storage or backend

#### Left Sidebar (Tabbed Navigation)

**Staff Tab**
- Shows all hired staff with details:
  - Name, Role, Category, Skill level
  - Contract type (Daily/Weekly/Monthly)
  - Days remaining
  - Payment status
- **Renew Contract Buttons** (when contract expires):
  - Renew Day (base fee)
  - Renew Week (~4.75x base)
  - Renew Month (~17x base)

**Studio Tab**
- Current active studio (or "None")
- Quality bonus applied
- Rental duration remaining (if rented)

**Equipment Tab**
- Lists all owned equipment by category
- Shows equipment count by type (Cameras, Lights, Dress/Props)
- Sell buttons for each item (at 50% of purchase price)
- Quality bonus contribution visible

#### Center Column (Production Operations)

**Production Section**
- **[Start Project]** button → Opens Production Modal
- **Theme Selector** (Label + Dropdown) - Switch between 3 CSS themes on-the-fly
- **Action Grid** (2-column layout):
  - Create Website (costs AP, disabled if 5+ websites exist)
  - Manage Website (disabled if no websites)
  - Training (for models/staff/owner)
  - Manage Economy (financial dashboard)
  - See Statistics (charts, trending)
  - Organize Party (team morale)
  - Each action shows AP cost in button label

**Inventory Section**
- **Filters & Search**:
  - Text search by title, description, location, model name
  - Type filter (by shoot type: basic, ad, movie, etc.)
  - Status filter (sold/unsold/all)
  - Freelance filter (only gigs, none, all)
  - Sort options: date (asc/desc), grade, gross revenue, net profit
  - Show Sold toggle
- **Item List** (scrollable):
  - Item cover image
  - Title, Type, Grade, Day produced
  - Models cast (mini chips)
  - Freelance company (if applicable)
  - Sale status & channel
  - Sale offers available (company/individual/sponsor)
  - Sell buttons for unsold items
- **Website Upload Option** (if applicable):
  - Select target website from dropdown
  - Upload video to chosen website

#### Right Sidebar (Freelance Operations)

**Freelance Section**
- **Toggle View** (Works ↔ Contracts button)
- **Works Tab** (Daily Freelance Gigs):
  - Lists available freelance opportunities each day
  - Company name, Ad type, Requirements (cast, min models, min grade)
  - Company relationship status
  - Suggested budget
  - Custom bid input
  - Bid/Skip buttons
  - Days until deadline
- **Contracts Tab**:
  - Active freelance contracts
  - Company info, requirements, agreed budget
  - Deadline (game day)

---

### 3. Main Game View - Mobile

**Activated when:** `started === true` && `isMobile` (viewport width < 900px)

**Component:** `MobileGameView.jsx`

**Layout:** Single-column vertical stacking

**Sections (Top to Bottom):**
1. **Company Banner** (image)
2. **Header Summary** (Company name, Day, Budget, Popularity, Reputation)
3. **Theme Selector Panel** (dropdown)
4. **Game Over Notice** (if applicable, border color red)
5. **Staff Card Section** (+ Add Staff button, scrollable list)
6. **Studio Card Section** (+ Add Studio button, current studio or none)
7. **Models Card Section** (+ Add Model button, list of hired roster)
8. **Produce Work Section**:
   - Equipment selection checklist (if owned)
   - Model list with work type buttons (Basic, Ad, Movie, etc.)
9. **Inventory Sales Section**:
   - Work type inventory counts
   - Sell buttons (Company/Individual/Sponsor)
   - Production list (scrollable, sold/unsold items)
10. **End Day Button** (full-width)
11. **Modal Overlays** (Staff, Studio, Model selection)

---

### 4. Special Pages

#### Model Creator Page (`/model-creator`)

**Component:** `ModelCreatorPage.jsx`

**Purpose:** Pre-game tool to view/customize 130 generated female + 30 male models

**Features:**
- **Model Generation System**:
  - 130 female models (1-130)
  - 30 male models (1-30)
  - Each gets:
    - Seeded random attributes (consistent per model)
    - Name from culturally-diverse name groups
    - Age, height, weight, body type, skin color
    - Ethnicity assignment
    - Quality score (1-100)
    - Fitness score (1-100)
    - Unlock reputation requirement (based on quality)
- **Model Queue Interface** (not editable in this version)
- **Attributes Visible**:
  - Name, Gender, Ethnicity, Age, Height, Weight
  - Body Type, Skin Color, Quality, Fitness
  - Unlock Reputation (tier-based requirement)

**Planned Customization:**
- Future versions may allow renaming, attribute tweaks, image swaps

#### Staff Creator Page (`/staff-creator`)

**Component:** `StaffCreatorPage.jsx`

**Purpose:** Edit and customize 50 staff members' skills in-game

**Staff Roles:**
- Directors (category: `director`)
- Cameramen (category: `camera`)
- Lighting Technicians (category: `light`)
- Sound Engineers (category: `sound`)
- Editors (category: `editor`)

**Features:**
- **Skill Adjustment** (1-100 range):
  - Input field per staff member
  - Auto-calculates on change:
    - Reputation = Skill / 2
    - Tier (Junior/Mid/Senior based on skill)
    - Daily Fee, Weekly Fee, Monthly Fee (calculated formulas)
- **Grouped Display** (by role):
  - 5 directors, 10 cameramen, 10 lighting, 10 sound, 10 editors (typical)
  - Cards show image, name, age, tier, fees
- **Generated Output**:
  - Outputs `staff.js` file content as editable textarea
  - Copy button to clipboard
  - Can replace `src/common/data/staff.js` with modified content

---

## Game Mechanics & Features

### Studio Acquisition & Management

**Available Studios:** Pre-defined catalog with variations

**Acquisition Methods:**
1. **Rent (Daily/Weekly/Monthly)**
   - Daily fees (10-50% of monthly)
   - Weekly fees (~40-50% of monthly)
   - Monthly fees (base rental cost)
   - Auto-renews or expires, prompts renewal
   - Can switch studios (old rental canceled, new one starts)
2. **Buy (One-time ownership)**
   - Higher upfront cost (3-5x monthly rental)
   - Owned studios never expire
   - Only one studio can be "active" at a time
   - If you own a studio, cannot rent another (blocked UI)

**Studio Properties:**
- Name
- Quality Bonus (added to all productions using this studio)
- Image URL
- Rental fees (day/week/month)
- Purchase price
- Associated shoot locations

---

### Model System

**Hiring Models:**
- Pool of 130 available female + 30 male models (unsealed availability)
- **Daily Contract Options:**
  - Day rate: 20% of monthly fee
  - Weekly rate: 95% of monthly fee
  - Monthly rate: Base fee
- **Dismissal:** Contracts expire; not renewed = removed from roster

**Model Attributes:**
- **Quality** (1-100): Affects production grade, contract fees
- **Fitness** (1-100): Energy for shoots; recovers overnight or via training
- **Stamina** (Default 100): Current energy; depletes during work; used in calculations
- **Popularity** (Individual): Rises from successful productions
- **Happiness**: Affected by party events, working conditions
- **Unlock Reputation Requirement**: Must reach X reputation before hiring (e.g., quality 100 = rep 80)

**Model Renewal Pricing:**
- Formula: `500 + (quality * 35)`
- Day: 20% of formula
- Week: 95% of formula
- Month: 100% of formula

---

### Staff System

**Hiring Staff:**
- Pool of 50 total staff across 5 roles
- **Contract Options** (same as models):
  - Daily, Weekly, Monthly
  - Fees vary by tier (Junior/Mid/Senior)
- **Staff Categories:**
  - Director: Creative lead for shoots
  - Camera: Recording quality impact
  - Lighting: Ambient/mood quality impact
  - Sound: Audio quality impact
  - Editor: Post-production quality impact

**Staff Attributes:**
- **Skill** (1-100): Primary attribute; affects production output
- **Tier** (calculated):
  - Junior: Skill 1-33
  - Mid: Skill 34-66
  - Senior: Skill 67-100
- **Reputation** (calculated): Skill / 2
- **Fees** (calculated):
  - Daily: Base + (Tier multiplier)
  - Weekly: Daily × 4.5-5
  - Monthly: Daily × 17-20

---

### Production System

**Starting a Project:**
- **Opened via:** "Start Project" button → Production Modal
- **Prerequisites:**
  - At least 1 model selected
  - At least 1 studio active
  - Staff assigned to required roles (or default to owner)
  - Required action points available (specific to work type)

**Production Workflow:**

1. **Setup Phase:**
   - Select work type (Basic, Ad, Movie, Body, Special)
   - Some types unlock at popularity thresholds (e.g., "Movie" at pop 30)
   - Choose models (cast multiple for ensemble)
   - Assign staff by role (director, camera, lighting, sound, editor)
   - Select equipment to use (quality bonuses stack)
   - Pick location (if studio has multiple)
   - Service level (none/low/medium/good/excellent) - affects budget & quality

2. **Content Metadata:**
   - Title: New (custom name) or Previous (reuse past title)
   - Description: Optional context
   - Banner/Thumbnail: Auto-generated or custom selector

3. **Preview & Estimation:**
   - Live preview of banner/thumbnail
   - Grade estimate (1-100)
   - Revenue estimate for each sales channel

4. **Execution:**
   - Click [Start Shoot]
   - Deducts AP, budget (if applicable), model/staff stamina
   - Auto-generates inventory item
   - Logs to shooting history

**Post-Production:**
- Item automatically added to Inventory
- Can be sold immediately or held
- **Sales Channels:**
  - **Company** (other studios): Fixed price negotiation
  - **Individual** (freelancers): Higher margins; requires reputation
  - **Sponsor** (product placement): Highest premium if freelance gig
  - **Website** (owned): Posts to website banner feed; boosts company metrics

---

### Financial System

**Revenue Sources:**
1. **Freelance Gigs** - Contract-based work (company pays agreed budget)
2. **Inventory Sales**:
   - Company sales (moderate revenue)
   - Individual sales (higher revenue)
   - Sponsor sales (premium if gig-linked)
3. **Affiliate/Ad Revenue** (from website content)

**Expenses:**
- **Studio Rental/Ownership**
- **Model/Staff Contracts** (daily, weekly, monthly)
- **Equipment Purchase**
- **Equipment Maintenance** (implied in quality cost)
- **Website Creation & Management**
- **Party Events** (morale boost, costs scale with team size)
- **Training Programs** (skill development, costs by target type)

**Economy Management Modal:**
- Financial ledger (all transactions)
- Daily breakdown (in/out per day)
- Payment deferral system (contracts can defer payment to end-of-period)
- Budget forecasting

---

### Relationship & Interview System

**Company Relations:**
- Multiple production companies in ecosystem
- Reputation affects gig offers and bid success rates
- Interview events (15% chance per day end)

**Interview Mechanics:**
- Triggered at end-of-day (15% random chance)
- **Interview Session** includes:
  - Context image & label
  - 3 random questions from pool
  - Multiple choice answers (A, B, C, D, etc.)
- **Answer Effects:**
  - Affects popularity (±5-15 based on choice)
  - Affects reputation (±5-10 based on choice)
  - Can trigger company relationship shifts
- **Skip Option:** Decline interview (no penalty, no gain)

---

### Training System

**Training Categories:**

1. **Owner Training** (Player skill development):
   - Multiple skill tracks (e.g., DirectionSkill, ProductionSkill, etc.)
   - Costs: Base cost + (current skill × cost-per-stat)
   - Improves quality of owned productions
   - Stamina cost to owner

2. **Model Training:**
   - Improves model quality
   - Costs: Based on current quality + option type
   - Stamina cost to model
   - Fitness recovery

3. **Staff Training:**
   - Improves staff skill
   - Costs: Based on current skill + option type
   - Stamina cost to staff

**Training Session:**
- Modal shows all trainable targets (owner + roster + hired staff)
- Select target → choose training option
- Deduct AP, money, and stamina
- Apply stat increases

---

### Website System

**Creating a Website:**
- Costs AP (default 5)
- Max 5 websites per company
- Each website has:
  - Custom domain name (e.g., "MyStudio.com")
  - Domain extension (.com, .net, .org, etc.)
  - Custom logo/image upload
  - Banner feed (content uploaded from inventory)

**Managing Websites:**
- Upload production to website banner feed (via Inventory)
- Website content increases visibility/reach
- Unlock sponsorship opportunities

---

### Party & Morale System

**Party Types:**
- Different party themes (Team Dinner, Celebration, Retreat, etc.)
- Each has image, description, cost formula
- Cost scales with team size (models + staff count)
- Duration (1 day boost to morale)

**Effects:**
- Stamina recovery for all team members
- Happiness increase
- Temporary quality bonus for next production

---

### Save/Load System

**Save Slots:**
- Multiple save slots (5+)
- Each slot stores:
  - Company name
  - Current day
  - Budget
  - Full game state (models, staff, inventory, etc.)
- Save to local storage or backend persistence

**Load Slot:**
- Replaces current game state with saved state
- Returns to main game screen

---

## UI Components & Sections

### Header Components

**HeroHeader** (`desktop/HeroHeader.jsx`)
- **Company Banner**: Background image from production
- **Company Info**: Name, active studio, staff/model counts
- **KPI Pills**:
  - Day counter (with clock icon)
  - Budget (with trending icon)
  - Popularity (with users icon)
  - Reputation (with shield icon)
  - AP gauge (with lightning icon)
- **Action Buttons**:
  - [End Day]
  - [Save Game]
  - Save slot selector + [Load]

### Section Components (Desktop Left Sidebar)

**StaffSection** (`desktop/StaffSection.jsx`)
- Header: "Staff" icon + title
- [+ Add Staff] button
- Scrollable list of hired staff
- Per-staff display: Image, Name, Role, Category, Skill, Tier, Contract type, Days left, Status
- Renewal buttons (if contract expired)
- Empty state message

**ModelsSection** (`desktop/ModelsSection.jsx`)
- Header: "Models" icon + title
- [+ Add Model] button
- Scrollable list of hired roster
- Per-model display: Image, Name, Gender, Ethnicity, Age, Height, Weight, Body type, Skin color
- Popularity, Fitness, Stamina, Happiness stats
- Contract info and renewal buttons
- Empty state

**StudioSection** (`desktop/StudioSection.jsx`)
- Header: "Studio" icon + title
- [+ Add Studio] button
- Current studio card (or empty state)
- Studio image, name, quality bonus, mode (own/rent), days left (if rental)

**EquipmentSection** (`desktop/EquipmentSection.jsx`)
- Header: "Equipment" icon + title
- [+ Buy Equipment] button
- Equipment count summary (Cameras, Lights, Dress)
- Scrollable equipment list
- Per-item: Name, Category, Sub-category, Quality bonus, Sell price + [Sell] button
- Empty state

### Center Column Components

**ProductionSection** (`desktop/ProductionSection.jsx`)
- Header: "Action" icon + title
- [Start Project] button
- Muted description
- **Theme Selector**: Label + Dropdown (Neumorphism/Glassmorphism/Claymorphism)
- **Action Grid** (2 columns):
  - Create Website
  - Manage Website
  - Training
  - Manage Economy
  - See Statistics
  - Organize Party
  - Each shows AP cost

**InventorySection** (`desktop/InventorySection.jsx`)
- Header: "Inventory Sales" title
- **Toolbar**:
  - Search input
  - Type filter (dropdown)
  - Status filter (all/sold/unsold)
  - Freelance filter
  - Sort dropdown
  - Show Sold toggle
- **Work Type Summary** (grid):
  - Per work type: Unsold count, Average grade, Sell buttons (Company/Individual/Sponsor)
- **Item List** (scrollable):
  - Per item: Cover image, Title, Type, Grade, Day, Models, Status (sold/unsold), Sale offers
  - For unsold: Sell buttons + optional website upload selector
  - Sort order: Date, Grade, Revenue (gross/net)

### Right Sidebar Component

**FreelanceSection** (`desktop/FreelanceSection.jsx`)
- Header: "Freelance Work" title + [Works/Contracts] toggle button
- **Works View** (Daily Gigs):
  - Muted status (no gigs or gig count)
  - Per gig: Company name, Ad type, Requirements (cast, min models, min grade), Relationship, Budget, Deadline (days)
  - Bid input + [Bid] button
  - [Skip] button
- **Contracts View** (Active):
  - Muted status (contract count)
  - Per contract: Company, Requirements, Relationship, Agreed budget, Deadline day
  - No action (display only)

---

## Modals & Dialogs

### Production Modal (`desktop/ProductionModal.jsx`)

**Trigger:** [Start Project] button

**Layout** (Multi-tab/Page):

**Page 1: Setup**
- Model Selection (multi-checkbox grid)
- Staff Assignment (dropdown per role: director, camera, light, sound, editor)
- Work Type Selector (radio buttons or tabs)
- Equipment Selection (checkbox grid with quality bonus labels)
- Location Selector (dropdown; available based on studio)
- Service Level (radio buttons: None/Low/Medium/Good/Excellent)

**Page 2: Content**
- Title Mode (radio: New or Previous)
  - If New: Text input for custom title
  - If Previous: Dropdown of past titles
- Description (text area)
- Banner/Thumbnail:
  - Preset selector (styles: Classic, Minimal, Vibrant, etc.)
  - Model selector for featured photo
  - Live preview (shows generated image)

**Page 3: Review & Confirm**
- Live preview of all selections
- Grade estimate
- Revenue estimates per channel (company/individual/sponsor)
- [Start Shoot] button (deducts AP, initiates production)
- [Cancel] button

---

### Staff Hiring Modal (`desktop/StaffModal.jsx`)

**Trigger:** [+ Add Staff] button in StaffSection

**Features:**
- **Search & Filter Toolbar**:
  - Text search (name, role, category)
  - Category filter (dropdown: All/Director/Camera/Light/Sound/Editor)
  - Sort options: Skill (asc/desc), Daily fee, Weekly fee, Monthly fee, Name
- **Staff Grid**:
  - Per staff: Image, Name, Role, Category, Skill, Tier
  - Daily/Weekly/Monthly hire buttons (showing fees)
  - Disabled if insufficient funds

**On Hire:**
- Deduct fee, add to roster
- Set contract type & days remaining
- Close modal

---

### Model Hiring Modal (`desktop/ModelModal.jsx`)

**Trigger:** [+ Add Model] button in ModelsSection

**Features:**
- **Search & Filter Toolbar**:
  - Text search (name, ethnicity, body type, etc.)
  - Gender filter (All/Male/Female)
  - Ethnicity filter (dropdown with ethnicities)
  - Quality level filter (Low/Mid/High)
  - Fitness filter (Low/Mid/High)
  - Sort options: Name, Quality, Fitness, Hiring fee, Popularity
- **Model Grid**:
  - Per model: Image, Name, Gender, Ethnicity, Age, Height, Weight, Body type, Skin color, Quality, Fitness, Popularity
  - Unlock reputation requirement (greyed out if not met)
  - Day/Week/Month hire buttons (showing calculated fees)
  - Meta items showing quality/fitness/popularity visually

**On Hire:**
- Deduct fee, add to roster
- Set contract type & days remaining

---

### Studio Modal (`desktop/StudioModal.jsx`)

**Trigger:** [+ Add Studio] button in StudioSection

**Features:**
- **Studio Catalog Grid**:
  - Per studio: Image, Name, Quality bonus badge, Status badge
  - Rental buttons (Day/Week/Month with fees)
  - Buy button (one-time cost)
  - Disabled states (owned, can't have multiple, insufficient funds)
- **Status Badges**:
  - "Owned By Default" (starting own-house)
  - "Owned" (purchased)
  - "Currently Rented" (active rental)
  - "Disabled (Another Studio Owned)" (can't rent multiple)
  - "Available" (can rent/buy)

---

### Equipment Modal (`desktop/EquipmentModal.jsx`)

**Trigger:** [+ Buy Equipment] button in EquipmentSection

**Features:**
- **Search & Filter Toolbar**:
  - Text search (equipment name)
  - Category filter (Camera/Light/Dress/etc.)
  - Sub-category filter (DSLR/Mirrorless/etc.)
  - Ownership filter (All/Owned/Not Owned)
  - Affordability filter (All/Affordable/Too Expensive)
  - Sort: Name, Price (asc/desc), Quality bonus
- **Equipment Grid**:
  - Per item: Name, Category, Sub-category, Quality bonus, Price
  - [Buy] button (disabled if already owned or insufficient funds)

---

### Interview Modal (`desktop/InterviewModal.jsx`)

**Trigger:** Random 15% chance at end-of-day

**Features:**
- Context image & label (visual storytelling)
- **Question Progression**:
  - Shows current question # of total (e.g., "Question 1 of 3")
  - Question text
  - 4 multi-choice options (A, B, C, D)
  - Click option to select (visual feedback)
- **Navigation**:
  - [Next] button (enabled after selection; submits if last question)
  - [Skip] button (decline interview, no reward/penalty)
- **Submission**:
  - On final answer → sends payload with question IDs and option IDs
  - Backend calculates popularity/reputation deltas
  - Closes modal on success

---

### Party Modal (`desktop/PartyModal.jsx`)

**Trigger:** [Organize Party] action button

**Features:**
- **Party Grid**:
  - Per party type: Image, Title, Description
  - Cost (dynamic based on team size)
  - AP cost
  - [Choose] button (disabled if insufficient funds/AP)
- **Display Info**:
  - Current budget
  - Current AP gauge

---

### Statistics Modal (`desktop/StatisticsModal.jsx`)

**Trigger:** [See Statistics] action button

**Data Displayed:**
- **Daily Snapshot** (current day):
  - Money, Popularity, Reputation, Stats
- **Growth Summary** (from start):
  - Money growth (delta)
  - Popularity growth
  - Reputation growth
- **Financial Summary**:
  - Total income (all positive transactions)
  - Total outflow (all negative transactions)
- **Charts** (last 40 days):
  - **Money Chart**: Line graph showing budget trend
  - **Daily Profit/Loss Chart**: Trend of net daily change
  - X-axis: Day numbers
  - Y-axis: Currency or count

---

### Closing Button

**ModalCloseButton** (`desktop/ModalCloseButton.jsx`)
- Simple X icon button
- Closes parent modal on click
- Fixed positioning (top-right corner)

---

## Data Management & Store

### Game Store (`common/store/gameStore.js`)

**Global State Management** using Zustand

**Core State Sections:**

#### Company Info
- `companyName`: String
- `money`: Number (current budget)
- `started`: Boolean (game started status)
- `day`: Number (current game day)
- `popularity`: Number (0-100+)
- `companyReputation`: Number (reputation score)
- `ownerStamina`: Number (default 100)
- `ownerSkills`: Object (training tracks keyed by skill name)

#### Roster & Staff
- `roster`: Array of hired models
- `hiredStaff`: Array of hired staff
- `modelPool`: Array of available models (from ModelCreator)
- `staffMarket`: Array of available staff (from StaffCreator)

#### Operations
- `activeStudio`: Object or null (currently active studio)
- `ownedEquipmentIds`: Array (IDs of owned equipment)
- `websites`: Array (created websites)
- `inventoryItems`: Array (produced content pieces)
- `shootingHistory`: Array (past productions for title reuse)

#### Contracts & Gigs
- `activeGigContracts`: Array (ongoing freelance contracts)
- `dailyFreelanceGigs`: Array (today's available gigs)
- `paymentsToMake`: Array (deferred contract payments due)

#### Catalogs
- `equipmentCatalog`: Array (all available equipment)
- `studioCatalog`: Array (all studios for rent/buy)
- `shootLocations`: Array (shoot location options per studio)

#### Configuration
- `workTypes`: Object (shoot type definitions)
- `partyOptions`: Object (party event types)
- `staffCategories`: Array (staff role categories)
- `ownerTrainingOptions`: Object (owner skill training)
- `banners`: Array (randomized banner images by day)

#### Statistics & History
- `dailyStats`: Array (daily snapshots for charting)
- `financeEntries`: Array (transaction history)
- `gameOverReason`: Object or null (game end condition)
- `gameOver`: Boolean

#### Selectors (Derived State)
- `selectHeaderSnapshot()`: Returns KPI summary for header
- Commonly memoized with `useMemo` to optimize renders

**Key Actions:**
- `startGame(companyName, budget)`: Initialize game state
- `endDay()`: Trigger end-of-day logic (contract checks, gig refresh, etc.)
- `hireStaff(staffId, contractType)`: Add staff to roster
- `hireModel(modelId, contractType)`: Add model to roster
- `rentStudio(studioId, term)`: Activate studio rental
- `buyStudio(studioId)`: Purchase studio
- `buyEquipment(equipmentId)`: Add equipment to inventory
- `produceWork(modelIds, staffMap, shootType, settings)`: Create production
- `sellInventoryItem(itemId, channel, options)`: Sell production
- `beginInterviewSession(options)`: Trigger interview
- `trainTarget(targetId, targetType, option)`: Apply training
- `organizeParty(partyKey)`: Host team party
- `saveGameSlot(slotNumber)`: Persist state
- `loadGameSlot(slotNumber)`: Restore saved state

---

### Data Files (`common/data/`)

#### **models.js**
- Exports function `createModelPool()` → Array of 130 female + 30 male objects
- Each model: id, gender, name, age, height, weight, ethnicity, skin color, quality, fitness, popularity, body type, unlock reputation, image URL

#### **staff.js**
- Exports function `createStaffMarket()` → Array of 50 staff objects
- By role: Directors (5), Cameramen (10), Lighting (10), Sound (10), Editors (10), etc.
- Each staff: id, name, role, category, image, age, skill, tier, daily fee, weekly fee, monthly fee, reputation

#### **staffCreatorUtils.js**
- `STAFF_CREATOR_CATEGORIES`: Array of staff categories (director, camera, light, sound, editor)
- `recalculateStaffBySkill(staff, newSkill)`: Updates tier, reputation, fees based on skill input
- Formulas for fee calculation

#### **companies.js**
- Exports production company data (used for freelance gigs)
- Company names, industries, budget ranges

#### **interview_1.js**
- Interview contexts (image URLs, labels)
- Interview question pools
- Multiple choice options with popularity/reputation deltas

---

### Utilities (`common/utils/`)

#### **localBannerGenerator.js**
- `BANNER_STYLE_PRESETS`: Object of banner design templates
- `generateLocalProductionBanner(config)`: Async function to generate banner image on-the-fly
  - Input: company name, title, preset, model image, dimensions
  - Output: Data URL (PNG/JPEG base64)
- Used in ProductionModal for live preview

#### **Shooting Type Assets** (`common/assets/`)
- `shooting-type-1.base64.txt`: Base64 encoded image for "Basic" work type
- `shooting-type-2.base64.txt`: "Ad" work type
- `shooting-type-3.base64.txt`: "Movie" work type
- `shooting-type-4.base64.txt`: "Body" work type
- `shooting-type-5.base64.txt`: "Special" work type
- Used as fallback icons in ProductionModal

---

## Customization Systems

### Theme System

**Available Themes:**
1. **Neumorphism** (default)
   - Soft, extruded 3D effect
   - Muted color palette
   - URL: `./css/themes/theme-neumorphism.css?url`

2. **Glassmorphism**
   - Frosted glass/translucency
   - Blur backdrop filters
   - URL: `./css/themes/theme-glassmorphism.css?url`

3. **Claymorphism**
   - Playful, soft, rounded edges
   - Warm color palette
   - URL: `./css/themes/theme-claymorphism.css?url`

**Theme Selection:**
- Dropdown in App start screen and ProductionSection
- Selection persists to `localStorage` as key `ui-theme`
- Applied via dynamic `<link rel="stylesheet">` injection into `<head>`
- Switches on-the-fly without page reload

---

### Model Customization (Pre-Game)

**Accessible via:** [Model Creator] link on start screen

**Customizable Attributes:**
- Name (currently view-only; planned for future)
- Age, Height, Weight, Body Type, Skin Color, Ethnicity
- Image (view-only; sourced from `/models/girls/*` or `/models/boys/*`)

**Generation Logic:**
- Seeded random generator (deterministic per model ID)
- Name groups by ethnicity for cultural diversity
- Quality unlocks reputation requirement (curves by percentile)

---

### Staff Customization (In-Game)

**Accessible via:** [Edit Skill] link on start screen / [Staff Creator] tab

**Customizable Attributes:**
- **Skill** (1-100): Primary knob
- Auto-calculated from skill:
  - Tier (Junior/Mid/Senior)
  - Reputation (Skill / 2)
  - Daily Fee, Weekly Fee, Monthly Fee

**Persistence:**
- Generate `staff.js` export
- Copy and replace `/src/common/data/staff.js` to persist changes

---

### Banner Customization

**During Production:**
- Banner Preset Selector (design template)
- Featured Model Selector (cast member for thumbnail)
- Live Preview (generated image)

**Presets Available:**
- Studio Classic
- Minimal
- Vibrant
- Dark
- Custom (if backend supports)

---

### Website Customization

**Website Creation:**
- Domain name (text input)
- Domain extension (.com, .net, .org, etc.)
- Logo upload (file input)

**Website Feed:**
- Upload production videos as content cards
- Custom ordering (drag-to-reorder, if implemented)

---

## File Structure

```
src/
├── App.jsx                          # Main app entry; pattern router
├── main.jsx                         # Vite entry point
│
├── common/                          # Shared across all patterns
│   ├── assets/
│   │   ├── shooting-type-1.base64.txt
│   │   ├── shooting-type-2.base64.txt
│   │   ├── shooting-type-3.base64.txt
│   │   ├── shooting-type-4.base64.txt
│   │   └── shooting-type-5.base64.txt
│   ├── data/
│   │   ├── companies.js             # Production company definitions
│   │   ├── interview_1.js           # Interview contexts & questions
│   │   ├── models.js                # Model pool generator
│   │   ├── staff.js                 # Staff market generator
│   │   └── staffCreatorUtils.js     # Staff calculation utilities
│   ├── store/
│   │   └── gameStore.js             # Zustand global state
│   └── utils/
│       └── localBannerGenerator.js  # Banner generation utility
│
├── patternA/                        # Pattern A (Current Default UI)
│   ├── App.jsx                      # Pattern A entry
│   ├── main.jsx                     # (Legacy; unused)
│   ├── components/
│   │   ├── DesktopGameView.jsx      # Main desktop game layout
│   │   ├── MobileGameView.jsx       # Main mobile game layout
│   │   ├── ModelCreatorPage.jsx     # Model creator tool
│   │   ├── StaffCreatorPage.jsx     # Staff creator tool
│   │   └── desktop/
│   │       ├── EquipmentModal.jsx
│   │       ├── EquipmentSection.jsx
│   │       ├── FreelanceSection.jsx
│   │       ├── HeroHeader.jsx
│   │       ├── InterviewModal.jsx
│   │       ├── InventorySection.jsx
│   │       ├── ModalCloseButton.jsx
│   │       ├── ModelMetaItem.jsx
│   │       ├── ModelModal.jsx
│   │       ├── ModelsSection.jsx
│   │       ├── PartyModal.jsx
│   │       ├── ProductionModal.jsx
│   │       ├── ProductionSection.jsx
│   │       ├── StaffModal.jsx
│   │       ├── StaffSection.jsx
│   │       ├── StatisticsModal.jsx
│   │       ├── StudioModal.jsx
│   │       └── StudioSection.jsx
│   ├── css/
│   │   ├── App.css
│   │   ├── desktop.css              # Desktop layout & components
│   │   ├── index.css                # Global styles
│   │   ├── mobile.css               # Mobile layout & components
│   │   └── themes/
│   │       ├── theme-neumorphism.css
│   │       ├── theme-glassmorphism.css
│   │       ├── theme-claymorphism.css
│   │       └── theme-backup.css
│   ├── pages/
│   │   └── DashboardPage.jsx        # (Legacy/unused)
│   └── (no data/store/utils - use common/)
│
└── patternB/                        # Pattern B (Alternative UI Design)
    ├── App.jsx                      # Pattern B entry; distinct design
    ├── css/
    │   ├── pattern-b.css            # Bold alternate visual system
    │   └── themes/                  # (Can reuse or override)
    ├── components/                  # (Can copy-customize or share)
    └── pages/                       # (Can copy-customize or share)
```

---

## Summary

Studio Tycoon Pattern A is a **comprehensive business simulation game** with:

- **Multiple revenue streams** (freelance, inventory sales, sponsorships)
- **Deep team management** (models, directors, cameramen, etc.)
- **Production pipeline** (concept → shoot → sale)
- **Dynamic economy** (pricing, reputation, relationships)
- **Player progression** (training, reputation, popularity unlocks)
- **Rich customization** (themes, models, staff, websites)
- **Save/load persistence** (multiple save slots)
- **Adaptive UI** (responsive mobile/desktop, theme switching)

**For Future Development:**
- Use this reference to identify features already implemented
- Test all mechanics before adding new patterns
- Ensure data models are compatible across pattern variations
- Document any new features similarly

---

**Document Version:** 1.0  
**Last Updated:** May 12, 2026  
**Pattern:** A (Base UI - Default)
