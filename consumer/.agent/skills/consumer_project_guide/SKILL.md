---
name: consumer_project_guide
description: Comprehensive guide for developing on the Consumer App (uni-app/Vue2) including SVN workflows, tech stack details, and coding standards.
---

# Consumer App Development Guide

This skill provides context and rules for working on the `consumer` project.

## 1. Version Control (SVN)

**System**: Subversion (SVN)  
**Client**: Command Line (`svn`) via PowerShell on Windows.

### Critical Rules
- **Commit Messages**: MUST be in **ENGLISH**.
  - *Reason*: Windows PowerShell encoding (GBK/CP936) conflicts with SVN Server (UTF-8), causing `????` garbled text for Chinese characters.
  - *Format*: `type: description` (e.g., `feat: add user login`, `fix: resolve page layout issue`).
- **Workflow**:
  1. `svn update` - Always update before starting work.
  2. `svn status` - Check changed files.
  3. `svn diff` - Review changes.
  4. `svn commit -m "feat: your english message"` - Commit changes.

## 2. Technology Stack

- **Framework**: uni-app (based on Vue 2.x).
- **UI Library**: uni-ui.
- **Platform Targets**:
  - WeChat Mini Program (AppID: `wxd7991022b6d34a2e`)
  - Alipay Mini Program (AppID: `2021005115611026`)
- **IDE**: HBuilderX (recommended for running/building), but code editing can be done in VS Code.

## 3. Core Architecture & Business Logic

This section maps the codebase to its actual roles in the running app.

### A. The "Heart": `common/common.js`
- **Role**: Global utility and state manager.
- **Key Functions**:
    - `osg.ajax`: Unified network request handler.
    - `osg.doLogin`: Silent login and session management.
    - `osg.codelabel`: Dictionary converter (converts DB status codes like `401` to human-readable strings like `待验收`).
    - `osg.open`: Centralized navigation handler.
- **Maintenance Note**: Any changes to API hosts or global behavior should happen here.

### B. The "Skeleton": `pages.json`
- **Role**: Routing and package management.
- **Architecture**:
    - **Main Package**: High-level entry pages (Home, Category, Mine).
    - **Sub-packages (`subpackages/`)**: Contains the bulk of business logic (Orders, Contracts, Payments) to keep the initial load small.

### C. High-Value Modules (`subpackages/`)
- **Order Lifecycle**: Found in `subpackages/serviceAppointment/`. This is where "Work Orders" are managed (Booking, In-progress, Acceptance, Evaluation).
- **Incentives & Income**: Found in `subpackages/income/`. Manages points, rewards, and withdrawals.
- **Estimates**: Found in `subpackages/quotationCalculator/`. Transparent pricing logic.

## 4. Project Structure (File Map)

## 5. Environment

- **OS**: Windows.
- **Shell**: PowerShell.
- **Encoding**: Default Windows (GBK). *Caution with file I/O or CLI outputs containing non-ASCII characters.*
