# Graph Report - .  (2026-04-22)

## Corpus Check
- Corpus is ~26,516 words - fits in a single context window. You may not need a graph.

## Summary
- 162 nodes · 220 edges · 40 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Test Setup & Leave Management|Test Setup & Leave Management]]
- [[_COMMUNITY_Application Boot & Authentication|Application Boot & Authentication]]
- [[_COMMUNITY_Event Management & UI Actions|Event Management & UI Actions]]
- [[_COMMUNITY_Base Page & Locator Strategy|Base Page & Locator Strategy]]
- [[_COMMUNITY_Claim Management & Table Verification|Claim Management & Table Verification]]
- [[_COMMUNITY_DB Config & Connection (Conf)|DB Config & Connection (Conf)]]
- [[_COMMUNITY_Employee Management (PIM)|Employee Management (PIM)]]
- [[_COMMUNITY_Sync & Assertion Utilities|Sync & Assertion Utilities]]
- [[_COMMUNITY_Employee Search & List|Employee Search & List]]
- [[_COMMUNITY_Installer Automation|Installer Automation]]
- [[_COMMUNITY_Employee Creation Flow|Employee Creation Flow]]
- [[_COMMUNITY_Profile & Personal Details|Profile & Personal Details]]
- [[_COMMUNITY_Teardown & Cleanup|Teardown & Cleanup]]
- [[_COMMUNITY_Safe Click Utilities|Safe Click Utilities]]
- [[_COMMUNITY_Logger Service|Logger Service]]
- [[_COMMUNITY_Page Stability & Waiters|Page Stability & Waiters]]
- [[_COMMUNITY_Mock Data Generation|Mock Data Generation]]
- [[_COMMUNITY_Startup Automation|Startup Automation]]
- [[_COMMUNITY_Timestamp & Unique Naming|Timestamp & Unique Naming]]
- [[_COMMUNITY_Network Interception|Network Interception]]
- [[_COMMUNITY_Linting Config|Linting Config]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_Common Utils Index|Common Utils Index]]
- [[_COMMUNITY_Login Selectors|Login Selectors]]
- [[_COMMUNITY_CRUD Test Suite 24|CRUD Test Suite 24]]
- [[_COMMUNITY_CRUD Test Suite 25|CRUD Test Suite 25]]
- [[_COMMUNITY_CRUD Test Suite 26|CRUD Test Suite 26]]
- [[_COMMUNITY_CRUD Test Suite 27|CRUD Test Suite 27]]
- [[_COMMUNITY_CRUD Test Suite 28|CRUD Test Suite 28]]
- [[_COMMUNITY_CRUD Test Suite 29|CRUD Test Suite 29]]
- [[_COMMUNITY_CRUD Test Suite 30|CRUD Test Suite 30]]
- [[_COMMUNITY_CRUD Test Suite 31|CRUD Test Suite 31]]
- [[_COMMUNITY_CRUD Test Suite 32|CRUD Test Suite 32]]
- [[_COMMUNITY_CRUD Test Suite 33|CRUD Test Suite 33]]
- [[_COMMUNITY_CRUD Test Suite 34|CRUD Test Suite 34]]
- [[_COMMUNITY_CRUD Test Suite 35|CRUD Test Suite 35]]
- [[_COMMUNITY_CRUD Test Suite 36|CRUD Test Suite 36]]
- [[_COMMUNITY_CRUD Test Suite 37|CRUD Test Suite 37]]
- [[_COMMUNITY_CRUD Test Suite 38|CRUD Test Suite 38]]
- [[_COMMUNITY_CRUD Test Suite 39|CRUD Test Suite 39]]

## God Nodes (most connected - your core abstractions)
1. `BasePage` - 12 edges
2. `getTableRowByText()` - 12 edges
3. `globalSetup()` - 9 edges
4. `EmployeePage` - 9 edges
5. `Conf` - 8 edges
6. `EventPage` - 8 edges
7. `ClaimPage` - 7 edges
8. `LeaveTypePage` - 7 edges
9. `getInputByLabel()` - 7 edges
10. `waitForTableRowVisible()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `waitForTableRowVisible()` --calls--> `expectVisible()`  [INFERRED]
  src\utils\common\sync_utils.ts → src\utils\common\expect_utils.ts
- `expectTableRowVisible()` --calls--> `getTableRowByText()`  [INFERRED]
  src\utils\dashboard\table_assertions.ts → src\utils\common\locator_utils.ts
- `expectTableRowHidden()` --calls--> `getTableRowByText()`  [INFERRED]
  src\utils\dashboard\table_assertions.ts → src\utils\common\locator_utils.ts
- `expectTableRowContains()` --calls--> `getTableRowByText()`  [INFERRED]
  src\utils\dashboard\table_assertions.ts → src\utils\common\locator_utils.ts
- `globalTeardown()` --calls--> `stopOrangeHRM()`  [INFERRED]
  global-teardown.ts → scripts\stop-orangehrm.ts

## Communities

### Community 0 - "Test Setup & Leave Management"
Cohesion: 0.12
Nodes (9): createClaimWithEvent(), deleteClaimAndEvent(), createEmployee(), deleteEmployee(), createEvent(), deleteEvent(), createLeaveType(), deleteLeaveType() (+1 more)

### Community 1 - "Application Boot & Authentication"
Cohesion: 0.23
Nodes (9): ensureConfFileInContainer(), globalSetup(), isDatabaseSchemaReady(), sleep(), startOrangeHRM(), stopOrangeHRM(), waitForContainersReady(), waitForLoginRouteReady() (+1 more)

### Community 2 - "Event Management & UI Actions"
Cohesion: 0.32
Nodes (2): EventPage, getInputByLabel()

### Community 3 - "Base Page & Locator Strategy"
Cohesion: 0.18
Nodes (2): BasePage, getTextareaByLabel()

### Community 4 - "Claim Management & Table Verification"
Cohesion: 0.26
Nodes (5): ClaimPage, getTableRowByText(), expectTableRowContains(), expectTableRowHidden(), expectTableRowVisible()

### Community 5 - "DB Config & Connection (Conf)"
Cohesion: 0.22
Nodes (1): Conf

### Community 6 - "Employee Management (PIM)"
Cohesion: 0.47
Nodes (1): EmployeePage

### Community 7 - "Sync & Assertion Utilities"
Cohesion: 0.33
Nodes (4): expectPollToBe(), expectVisible(), waitForLocatorEnabled(), waitForTableRowVisible()

### Community 8 - "Employee Search & List"
Cohesion: 0.47
Nodes (1): EmployeeListPage

### Community 9 - "Installer Automation"
Cohesion: 0.4
Nodes (0): 

### Community 10 - "Employee Creation Flow"
Cohesion: 0.5
Nodes (1): AddEmployeePage

### Community 11 - "Profile & Personal Details"
Cohesion: 0.5
Nodes (1): PersonalDetailsPage

### Community 12 - "Teardown & Cleanup"
Cohesion: 0.5
Nodes (2): globalTeardown(), stopOrangeHRM()

### Community 13 - "Safe Click Utilities"
Cohesion: 0.83
Nodes (3): boxedStep(), safeClick(), safeClick2()

### Community 14 - "Logger Service"
Cohesion: 0.5
Nodes (0): 

### Community 15 - "Page Stability & Waiters"
Cohesion: 1.0
Nodes (2): boxedStep(), waitForPageStability()

### Community 16 - "Mock Data Generation"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Startup Automation"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Timestamp & Unique Naming"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Network Interception"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Linting Config"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Playwright Config"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Common Utils Index"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Login Selectors"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "CRUD Test Suite 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "CRUD Test Suite 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "CRUD Test Suite 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "CRUD Test Suite 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "CRUD Test Suite 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "CRUD Test Suite 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "CRUD Test Suite 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "CRUD Test Suite 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "CRUD Test Suite 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "CRUD Test Suite 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "CRUD Test Suite 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "CRUD Test Suite 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "CRUD Test Suite 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "CRUD Test Suite 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "CRUD Test Suite 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "CRUD Test Suite 39"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Startup Automation`** (2 nodes): `start-orangehrm.ts`, `startOrangeHRM()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Timestamp & Unique Naming`** (2 nodes): `timestamp.ts`, `uniqueName()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Network Interception`** (2 nodes): `waitForResponseContaining()`, `network_utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Linting Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Playwright Config`** (1 nodes): `playwright.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Common Utils Index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Selectors`** (1 nodes): `login_selectors.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 24`** (1 nodes): `create-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 25`** (1 nodes): `delete-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 26`** (1 nodes): `read-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 27`** (1 nodes): `update-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 28`** (1 nodes): `create-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 29`** (1 nodes): `delete-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 30`** (1 nodes): `read-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 31`** (1 nodes): `update-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 32`** (1 nodes): `create-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 33`** (1 nodes): `delete-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 34`** (1 nodes): `read-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 35`** (1 nodes): `update-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 36`** (1 nodes): `create-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 37`** (1 nodes): `delete-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 38`** (1 nodes): `read-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CRUD Test Suite 39`** (1 nodes): `update-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BasePage` connect `Base Page & Locator Strategy` to `Event Management & UI Actions`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `getTableRowByText()` connect `Claim Management & Table Verification` to `Test Setup & Leave Management`, `Event Management & UI Actions`, `Base Page & Locator Strategy`, `Employee Management (PIM)`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `waitForTableRowVisible()` connect `Sync & Assertion Utilities` to `Test Setup & Leave Management`, `Event Management & UI Actions`, `Claim Management & Table Verification`, `Employee Management (PIM)`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `getTableRowByText()` (e.g. with `.update()` and `.delete()`) actually correct?**
  _`getTableRowByText()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `globalSetup()` (e.g. with `.goto()` and `.login()`) actually correct?**
  _`globalSetup()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Test Setup & Leave Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._