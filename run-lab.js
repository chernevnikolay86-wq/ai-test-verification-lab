"use strict";

const path = require("path");
const { runSuite } = require("./test/harness");
const weakSuite = require("./test/weak-ai-tests");
const verificationSuite = require("./test/verification-tests");

const root = __dirname;
const targets = {
  candidate: "./src/order-pricing.js",
  repaired: "./src/order-pricing-repaired.js",
};
const mutants = [
  { name: "coupon-threshold-strict", file: "./src/mutants/coupon-threshold-strict.js" },
  { name: "vip-before-coupon", file: "./src/mutants/vip-before-coupon.js" },
  { name: "shipping-after-coupon", file: "./src/mutants/shipping-after-coupon.js" },
  { name: "unknown-coupon-accepted", file: "./src/mutants/unknown-coupon-accepted.js" },
];

function load(relativeFile) {
  return require(path.join(root, relativeFile));
}

function printResult(label, result) {
  const status = result.failures.length === 0 ? "PASS" : "FAIL";
  console.log(`${label}: ${status} ${result.passed}/${result.total}`);
  for (const failure of result.failures) {
    console.log(`  - ${failure.name}: ${failure.message}`);
  }
  return result.failures.length === 0;
}

function runWeak() {
  return printResult("WEAK TESTS against flawed candidate", runSuite(weakSuite, load(targets.candidate)));
}

function runCandidateVerification() {
  const result = runSuite(verificationSuite, load(targets.candidate));
  printResult("STRONG VERIFICATION against flawed candidate", result);
  const expectedFailures = [
    "applies SAVE10 at the inclusive 2000-cent boundary",
    "calculates VIP discount after the coupon discount",
    "keeps shipping free at the original 5000-cent threshold after a coupon",
    "rejects an unknown coupon instead of pricing it as no coupon",
  ];
  const actualFailures = result.failures.map((failure) => failure.name);
  const caughtAll = expectedFailures.length === actualFailures.length
    && expectedFailures.every((name) => actualFailures.includes(name));
  console.log(`CRITIQUE of flawed candidate: ${caughtAll ? "PASS" : "FAIL"} ${actualFailures.length}/${expectedFailures.length} declared defects caught`);
  return caughtAll;
}

function runRepairedVerification() {
  return printResult("STRONG VERIFICATION against repaired implementation", runSuite(verificationSuite, load(targets.repaired)));
}

function runMutation() {
  let detected = 0;
  for (const mutant of mutants) {
    const result = runSuite(verificationSuite, load(mutant.file));
    const killed = result.failures.length > 0;
    if (killed) detected += 1;
    console.log(`MUTANT ${mutant.name}: ${killed ? "CAUGHT" : "SURVIVED"} (${result.failures.length} verification failure${result.failures.length === 1 ? "" : "s"})`);
  }
  const passed = detected === mutants.length;
  console.log(`MUTATION GATE: ${passed ? "PASS" : "FAIL"} ${detected}/${mutants.length} declared mutants caught`);
  return passed;
}

function usage() {
  console.log("Usage: node run-lab.js <weak|verify-candidate|verify-repaired|mutation|all>");
}

function main(command) {
  switch (command) {
    case "weak":
      return runWeak();
    case "verify-candidate":
      return runCandidateVerification();
    case "verify-repaired":
      return runRepairedVerification();
    case "mutation":
      return runMutation();
    case "all": {
      console.log("PLAN: six pricing rules are stated in README.md.");
      console.log("GENERATE: inspect the intentionally flawed AI-style candidate.");
      const weakPasses = runWeak();
      const critiquePasses = runCandidateVerification();
      console.log("REPAIR: verify the reference repair before approving it.");
      const repairPasses = runRepairedVerification();
      console.log("APPROVE: seed one defect at a time and require verification to catch each one.");
      const mutationPasses = runMutation();
      const approved = weakPasses && critiquePasses && repairPasses && mutationPasses;
      console.log(`LAB GATE: ${approved ? "PASS" : "FAIL"}`);
      return approved;
    }
    default:
      usage();
      return false;
  }
}

const command = process.argv[2];
const passed = main(command);
process.exitCode = passed ? 0 : 1;
