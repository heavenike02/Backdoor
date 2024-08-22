// Translation mapping
export interface TranslationMapping {
  [lang: string]: {
    [key: string]: string;
  };
}

export interface Config {
  countryFilter?: boolean;
  redirectUrl?: string;
  logoUrl?: string;
  text?: string;
  styles?: {
    modalBackgroundColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    modalTextColor?: string;
    textColor?: string;
    fontSize?: string;
    headingColor?: string;
    linkColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
  };
}

export interface Institution {
  id: string;
  name: string;
  logo: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
}

export interface Country {
  id: string;
  name: string;
  logo: string;
}