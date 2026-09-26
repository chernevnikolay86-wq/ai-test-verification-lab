# Your AI just wrote 40 tests. How many catch a real bug?

A **free, 10-minute runnable lab**. It shows the one thing nobody checks about AI-generated tests: whether they actually catch defects — or just look like they do.

No install, no packages, no account. Just Node 20+.

```bash
git clone <this repo> && cd <this repo>
node run-lab.js all
```

## What you'll watch happen

The lab hands the AI's own test suite a pricing function that is **genuinely broken** (four seeded defects). Then it runs an independent verification suite against the same broken code.

```text
WEAK TESTS (the AI's own suite) ......... PASS 3/3
STRONG VERIFICATION ..................... FAIL 8/12
CRITIQUE of flawed candidate ............ 4/4 defects caught
MUTATION GATE ........................... PASS 4/4
LAB GATE: PASS
```

The AI's tests **pass 3/3 against code that is wrong.** Verification is what fails — and failing is the point: it proves the suite can tell correct behavior from a real defect. Green was never the goal.

## Why this matters

A passing run confuses three different claims, and only the third earns trust:

1. **The test runs.** Table stakes, not trust.
2. **The test agrees with the code** — including the code's bugs.
3. **The test tells right from wrong** — it fails when the behavior is wrong.

AI output rarely earns #3 on its own. Accept it anyway and your confidence is *borrowed*, not real. This lab is the smallest proof of the fix: challenge every generated test with a relevant defect before you trust it.

## Try it yourself

```bash
node run-lab.js weak              # the AI's suite passes against broken code
node run-lab.js verify-candidate  # verification catches the 4 real defects
node run-lab.js verify-repaired   # the repaired code passes 12/12
node run-lab.js mutation          # seed one defect at a time — each is caught
node run-lab.js all               # the whole loop → LAB GATE: PASS
```

Open `src/order-pricing.js` (the flawed candidate) and `test/verification-tests.js` (the discriminating suite). Before reading the verification tests, try to write the smallest test that would catch each defect. That habit — *design the discriminating test, then generate* — is the whole method.

> **Scope, honestly:** this is a didactic simulator with **declared** defects. It proves the *method* catches faults; it is not a claim about any real product, and no assertion is made that a particular AI model wrote the flawed candidate.

## Get the full thing — $19

This lab is chapter one of **AI-Assisted Software Testing in Practice** — the verification-first field guide + runnable agent kit for QA engineers who use AI:

- 17 chapters across 6 parts + appendices
- runnable labs across **unit, web/API, instrument-cluster, and CAN/UDS bus** domains
- a prompt/context/skills kit + governed agent role cards
- the governed **System Builder** (interviews you, previews a setup, never writes live)
- a **local & offline** model chapter for regulated teams
- reproduce the whole bundle with one command: `./verify.sh → BUNDLE GATE: PASS`

**→ Get the bundle for $19 (launch price): https://nikolaychernev.gumroad.com/l/ai-testing-in-practice**

*By N. Chernev, Lead Test Engineer — from an automotive and embedded software-testing background. Aligned with ISTQB CT-GenAI and ISO/IEC/IEEE 29119 (alignment is not endorsement).*

## License

See `LICENSE`. Free to run and share for evaluation, education, and feedback; not licensed for resale or production reliance.
