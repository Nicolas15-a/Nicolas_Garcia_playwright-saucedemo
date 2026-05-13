🛠 Phase 1: Requirement Analysis & Scoping
Tool: Gemini 1.5 Pro
Goal: Translate raw business requirements into a technical roadmap.

Prompt Strategy: "Act as a Lead SDET. Analyze these requirements for SauceDemo and identify the 'Golden Path' for testing. Highlight delivery constraints and mandatory tooling (Playwright, TypeScript, StorageState)."

Outcome: A prioritized list of features and a clear understanding of Nuaav's evaluation criteria (Isolation, Parallelism, and POM).

🏗 Phase 2: Framework Architecture & Scoping
Tool: Claude 3 Opus
Goal: Generate a scalable Page Object Model (POM) structure.

Prompt Strategy: "Create a Playwright project structure using the Page Object Model. Include a directory for pages, tests, and fixtures. Ensure the use of test.extend to inject Page Objects directly into tests to keep them clean and DRY."

Outcome: A clean, modular boilerplate that follows the latest Playwright best practices.

🛡 Phase 3: Logic Audit & Security Review (Zero-Context Pass)
Tool: Claude 3 Opus (Independent Instance / Antigravity Agent)
Goal: Verification of logic and identification of security vulnerabilities.

Prompt Strategy: "Here is a code snippet for a Playwright framework. Without knowing the previous context, audit this for logic flaws, security vulnerabilities (like credential leaking), and anti-patterns in test automation."

Outcome: Validation that the authentication flow was secure and that storageState was correctly handled without exposing sensitive data.

📖 Phase 4: Technical Documentation & Cross-Reference
Tool: Copilot (Gemini Pro Integrated)
Goal: In-depth documentation of every module.

Prompt Strategy: "Explain the relationship between the fixtures/base.fixture.ts and the auth.setup.ts file. How does the setup file ensure data isolation?"

Outcome: Detailed internal documentation that was matched against personal experience to ensure the framework was actually functional and maintainable.

🎭 Phase 5: Senior Narrative & Storytelling
Tool: Gemini
Goal: Condensing technical complexity into a professional narrative for stakeholders.

Prompt Strategy: "Translate this technical setup into a 'Senior Storytelling' format for a README. Focus on how we achieved 100% test isolation and why we chose certain trade-offs for performance. Use analogies to explain the Page Object Model."

Outcome: A high-impact README and Onboarding guide that speaks to both technical and non-technical stakeholders.

🔑 Key Prompting Techniques Used:
Persona-Based Prompting: "Act as a Senior/Lead QA Engineer."

Constraint-Based Prompting: "Ensure no custom hooks are used for screenshots; use the built-in 'only-on-failure' config."

Structure-First Prompting: "Provide a structure based strictly on POM."

Iterative Refinement: Using multiple LLM instances to cross-verify code quality and "blind spots."