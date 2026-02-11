export interface Country {
  name: string;
  code: string;
}

export const COUNTRIES: Country[] = [
  // North America
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "Mexico", code: "MX" },
  
  // Central America
  { name: "Costa Rica", code: "CR" },
  { name: "Guatemala", code: "GT" },
  { name: "Honduras", code: "HN" },
  { name: "Nicaragua", code: "NI" },
  { name: "Panama", code: "PA" },
  { name: "El Salvador", code: "SV" },
  { name: "Belize", code: "BZ" },

  // South America
  { name: "Argentina", code: "AR" },
  { name: "Bolivia", code: "BO" },
  { name: "Brazil", code: "BR" },
  { name: "Chile", code: "CL" },
  { name: "Colombia", code: "CO" },
  { name: "Ecuador", code: "EC" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Uruguay", code: "UY" },
  { name: "Venezuela", code: "VE" },

  // Caribbean
  { name: "Dominican Republic", code: "DO" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Cuba", code: "CU" },
  { name: "Jamaica", code: "JM" },

  // Europe (Major)
  { name: "United Kingdom", code: "GB" },
  { name: "European Union", code: "EU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Spain", code: "ES" },
  { name: "Italy", code: "IT" },
  { name: "Netherlands", code: "NL" },
  { name: "Switzerland", code: "CH" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Ireland", code: "IE" },
  { name: "Portugal", code: "PT" },

  // Asia (Major)
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "India", code: "IN" },
  { name: "South Korea", code: "KR" },
  { name: "Singapore", code: "SG" },
  { name: "Israel", code: "IL" },
  { name: "United Arab Emirates", code: "AE" },

  // Oceania
  { name: "Australia", code: "AU" },
  { name: "New Zealand", code: "NZ" },

  // Africa (Major)
  { name: "South Africa", code: "ZA" },
  { name: "Nigeria", code: "NG" },
  { name: "Egypt", code: "EG" },
  { name: "Kenya", code: "KE" },
];
