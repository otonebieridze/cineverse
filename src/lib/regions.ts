const FALLBACK_REGION = "US";

// maximize() fills in the likeliest region: "en" -> "US", "ka" -> "GE". Region codes that
// aren't countries, like "419" (Latin America), fall back too.
export function regionFromLanguage(language: string): string {
  try {
    const { region } = new Intl.Locale(language).maximize();
    return region && /^[A-Z]{2}$/.test(region) ? region : FALLBACK_REGION;
  } catch {
    return FALLBACK_REGION;
  }
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function getRegionName(code: string): string {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}
