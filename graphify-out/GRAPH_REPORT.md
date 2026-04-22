# Graph Report - E:\Projects\AGT\OrangeHRM-UI-E2E  (2026-04-23)

## Corpus Check
- 61 files · ~37,592 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 170 nodes · 198 edges · 48 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `BasePage` - 12 edges
2. `globalSetup()` - 10 edges
3. `ClaimActions` - 10 edges
4. `EmployeeActions` - 9 edges
5. `EventActions` - 8 edges
6. `LeaveTypeActions` - 7 edges
7. `getInputByLabel()` - 7 edges
8. `requireEnv()` - 6 edges
9. `install()` - 5 edges
10. `loadProjectEnv()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `stopOrangeHRM()` --calls--> `loadProjectEnv()`  [INFERRED]
  E:\Projects\AGT\OrangeHRM-UI-E2E\scripts\stop-orangehrm.ts → E:\Projects\AGT\OrangeHRM-UI-E2E\utils\env.ts
- `getDbRootPassword()` --calls--> `requireEnv()`  [INFERRED]
  E:\Projects\AGT\OrangeHRM-UI-E2E\configs\global-setup.ts → E:\Projects\AGT\OrangeHRM-UI-E2E\utils\env.ts
- `getDbName()` --calls--> `requireEnv()`  [INFERRED]
  E:\Projects\AGT\OrangeHRM-UI-E2E\configs\global-setup.ts → E:\Projects\AGT\OrangeHRM-UI-E2E\utils\env.ts
- `globalSetup()` --calls--> `loadProjectEnv()`  [INFERRED]
  E:\Projects\AGT\OrangeHRM-UI-E2E\configs\global-setup.ts → E:\Projects\AGT\OrangeHRM-UI-E2E\utils\env.ts
- `globalSetup()` --calls--> `requireEnv()`  [INFERRED]
  E:\Projects\AGT\OrangeHRM-UI-E2E\configs\global-setup.ts → E:\Projects\AGT\OrangeHRM-UI-E2E\utils\env.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (9): createClaimWithEvent(), deleteClaimAndEvent(), createEmployee(), deleteEmployee(), createEvent(), deleteEvent(), createLeaveType(), deleteLeaveType() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (3): DashboardPage, EmployeeActions, LoginPage

### Community 2 - "Community 2"
Cohesion: 0.21
Nodes (13): loadProjectEnv(), requireEnv(), getDbName(), getDbRootPassword(), globalSetup(), gotoLoginAndWaitForForm(), isAppConfigured(), isDatabaseSchemaReady() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (2): ClaimActions, DatabaseUtils

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (1): BasePage

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (2): EventActions, getInputByLabel()

### Community 6 - "Community 6"
Cohesion: 0.32
Nodes (5): getTableRowByText(), getTextareaByLabel(), expectTableRowContains(), expectTableRowHidden(), expectTableRowVisible()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (4): expectPollToBe(), expectVisible(), waitForLocatorEnabled(), waitForTableRowVisible()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (2): globalTeardown(), stopOrangeHRM()

### Community 9 - "Community 9"
Cohesion: 0.83
Nodes (3): boxedStep(), safeClick(), safeClick2()

### Community 10 - "Community 10"
Cohesion: 0.5
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (2): boxedStep(), waitForPageStability()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (1): ClaimPage

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (1): EmployeePage

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (1): EventPage

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (1): LeaveTypePage

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **4 isolated node(s):** `ClaimPage`, `EmployeePage`, `EventPage`, `LeaveTypePage`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 14`** (2 nodes): `ClaimPage`, `ClaimPage.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `EmployeePage.ts`, `EmployeePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `EventPage.ts`, `EventPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `LeaveTypePage.ts`, `LeaveTypePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `timestamp.ts`, `uniqueName()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `network_utils.ts`, `waitForResponseContaining()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `playwright.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `build_graph.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `extract_ast.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `final_report.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `merge_extract.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `ClaimLocators.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `EmployeeLocators.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `EventLocators.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `LeaveTypeLocators.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `create-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `delete-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `read-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `update-claim.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `create-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `delete-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `read-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `update-employee.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `create-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `delete-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `read-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `update-event.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `create-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `delete-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `read-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `update-leave-type.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `login_selectors.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `globalSetup()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `install()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `globalSetup()` (e.g. with `loadProjectEnv()` and `requireEnv()`) actually correct?**
  _`globalSetup()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClaimPage`, `EmployeePage`, `EventPage` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._