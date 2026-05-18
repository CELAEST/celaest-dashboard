const DEFAULT_CASES = [
  { country: "US", currency: "USD", zeroDecimal: false },
  { country: "CO", currency: "COP", zeroDecimal: true },
  { country: "MX", currency: "MXN", zeroDecimal: false },
  { country: "ES", currency: "EUR", zeroDecimal: false },
  { country: "CL", currency: "CLP", zeroDecimal: true },
  { country: "AR", currency: "ARS", zeroDecimal: true },
  { country: "BR", currency: "BRL", zeroDecimal: false },
  { country: "PE", currency: "PEN", zeroDecimal: false },
];

const apiBaseUrl = (process.env.QA_API_URL || process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001").replace(/\/$/, "");
const selectedCountries = process.env.QA_GEO_COUNTRIES
  ? new Set(process.env.QA_GEO_COUNTRIES.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean))
  : null;
const cases = selectedCountries
  ? DEFAULT_CASES.filter((testCase) => selectedCountries.has(testCase.country))
  : DEFAULT_CASES;

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function unwrapEnvelope(payload) {
  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success !== true) {
      throw new Error(payload.error?.message || "API returned an unsuccessful response");
    }
    return payload.data;
  }

  return payload;
}

function isValidMoneyValue(value, zeroDecimal) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return false;
  return zeroDecimal ? Number.isInteger(value) : Number.isInteger(Math.round(value * 100));
}

async function resolvePricing(country) {
  const url = new URL(`${apiBaseUrl}/api/v1/public/pricing/resolve`);
  url.searchParams.set("country", country);

  const response = await fetch(url);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${payload?.error?.message || text}`);
  }

  return unwrapEnvelope(payload);
}

console.log(`Geo-pricing QA against ${apiBaseUrl}`);
console.log(`Countries: ${cases.map((testCase) => testCase.country).join(", ")}`);

for (const testCase of cases) {
  try {
    const pricing = await resolvePricing(testCase.country);
    const plans = Array.isArray(pricing?.plans) ? pricing.plans : [];

    assert(pricing?.country_code === testCase.country, `${testCase.country}: expected country_code ${testCase.country}, got ${pricing?.country_code}`);
    assert(pricing?.currency?.code === testCase.currency, `${testCase.country}: expected currency ${testCase.currency}, got ${pricing?.currency?.code}`);
    assert(pricing?.currency?.is_zero_decimal === testCase.zeroDecimal, `${testCase.country}: expected is_zero_decimal ${testCase.zeroDecimal}, got ${pricing?.currency?.is_zero_decimal}`);
    assert(typeof pricing?.exchange_rate === "number" && pricing.exchange_rate > 0, `${testCase.country}: exchange_rate must be a positive number`);
    assert(typeof pricing?.ppp_factor === "number" && pricing.ppp_factor > 0, `${testCase.country}: ppp_factor must be a positive number`);
    assert(plans.length > 0, `${testCase.country}: expected at least one resolved plan`);

    for (const plan of plans) {
      assert(plan.currency_code === testCase.currency, `${testCase.country}/${plan.plan_code}: expected plan currency ${testCase.currency}, got ${plan.currency_code}`);
      assert(isValidMoneyValue(plan.local_price_monthly, testCase.zeroDecimal), `${testCase.country}/${plan.plan_code}: invalid monthly price ${plan.local_price_monthly}`);
      assert(isValidMoneyValue(plan.local_price_yearly, testCase.zeroDecimal), `${testCase.country}/${plan.plan_code}: invalid yearly price ${plan.local_price_yearly}`);

      if (testCase.country !== "US" && Number(plan.original_price_monthly) > 0 && !plan.is_override) {
        assert(plan.local_price_monthly !== plan.original_price_monthly, `${testCase.country}/${plan.plan_code}: local monthly price did not change from original USD price`);
      }
    }

    const samplePlan = plans.find((plan) => Number(plan.local_price_monthly) > 0) || plans[0];
    console.log(`PASS ${testCase.country} -> ${testCase.currency} | rate=${pricing.exchange_rate} | plans=${plans.length} | sample=${samplePlan?.plan_code}:${samplePlan?.local_price_monthly}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const friendlyMessage = message === "fetch failed"
      ? `fetch failed (${apiBaseUrl} is not reachable; start the backend or set QA_API_URL)`
      : message;
    failures.push(`${testCase.country}: ${friendlyMessage}`);
    console.log(`FAIL ${testCase.country}`);
  }
}

if (failures.length > 0) {
  console.error("\nGeo-pricing QA failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nGeo-pricing QA passed.");
