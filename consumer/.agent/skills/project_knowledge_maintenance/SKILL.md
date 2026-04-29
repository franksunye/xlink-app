---
name: project_knowledge_maintenance
description: Guide for maintaining and updating the project's knowledge base and documentation, ensuring the Agent's context remains current with the codebase.
---

# Project Knowledge Maintenance Skill

This skill outlines the procedures for maintaining the project's knowledge base (Skills) and general documentation. It is designed to be used when the codebase evolves, ensuring that the Agent's "mental model" of the project stays accurate.

## 1. When to Update Knowledge

You should activate this skill (or prompt the user to) when:
- **Project Structure Changes**: New top-level directories or significant architectural shifts.
- **New Tech Stack**: Introducing a new library, framework, or tool (e.g., switching CSS preprocessors).
- **Process Changes**: Changing commit message rules, branching strategies, or deployment flows.
- **Recurring Issues**: A bug or setup issue occurs more than twice. It should be documented.

## 2. Maintenance Tasks

### A. Updating `consumer_project_guide`
The `consumer_project_guide` is the **Source of Truth**.
1. **Read**: Always start by reading `.agent/skills/consumer_project_guide/SKILL.md`.
2. **Analyze**: Compare the current codebase state (using `list_dir`, `view_file`) with the descriptions in the guide.
3. **Update**:
   - If directories code have changed, update **3. Project Structure**.
   - If new SVN rules are applied, update **1. Version Control**.
   - If build commands change, update **Environment** or add a **Build & Run** section.

### B. Creating New Specialized Skills
Don't stuff everything into one guide. If a topic becomes complex, split it out.
- **Criteria**: If a section in the main guide exceeds 50 lines or requires multiple files (templates, scripts), create a new Skill.
- **Naming**: Use `snake_case` (e.g., `db_schema_docs`, `api_integration_patterns`).
- **Structure**:
  - `SKILL.md` (Required)
  - `resources/` (Optional: for SQL dumps, API JSON schemas)
  - `examples/` (Optional: snippet code)

### C. SVN Operations for Skills
Since this project uses SVN, all knowledge updates must be committed immediately to be shared.
1. **Add**: If new files/dirs are created in `.agent/`, use `svn add .agent --force` (or specific paths).
2. **Commit**: Use the standard English format: `docs: update knowledge base for [topic]`.

## 3. Knowledge Verification Process

After updating documentation, perform a **Self-Correction Check**:
- [ ] Does `README.md` align with `consumer_project_guide`?
- [ ] Are the SVN commit rules in the guide still practical for the user's environment?
- [ ] Are all path references (e.g., `pages.json`) still valid?

## 4. Example: How to Log a "Legacy Code quirk"
 If you find a weird logic that *must* be preserved (e.g., a specific hardcoded ID):
1. Open/Create a relevant skill (e.g., `business_logic_rules`).
2. Add a section:
   ```markdown
   ### Hardcoded Rules
   - **Store ID 999**: This ID is reserved for testing and must strictly bypass validation. See `common/utils.js`.
   ```
