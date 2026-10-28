/**
 * Form validation and typo correction utilities for MonPremierCV
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: {
    typoDomain: string;
    suggestedDomain: string;
    fixedEmail: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Common domain typos mapped to correct domain names
export const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  // Gmail typos
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmzil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmail.fr': 'gmail.com',
  'gmaill.fr': 'gmail.com',
  
  // Hotmail typos
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'homail.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'hotmial.fr': 'hotmail.fr',
  'homail.fr': 'hotmail.fr',
  'hotmai.fr': 'hotmail.fr',

  // Outlook typos
  'outllok.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'otlook.com': 'outlook.com',
  'outklook.com': 'outlook.com',
  'outllok.fr': 'outlook.fr',
  'outlok.fr': 'outlook.fr',

  // Yahoo typos
  'yahou.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'yahou.fr': 'yahoo.fr',
  'yaho.fr': 'yahoo.fr',
  'yhaoo.fr': 'yahoo.fr',

  // iCloud typos
  'iclou.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'iclould.com': 'icloud.com',

  // French ISPs typos
  'wanado.fr': 'wanadoo.fr',
  'orage.fr': 'orange.fr',
  'ornage.fr': 'orange.fr',
  'sff.fr': 'sfr.fr',
  'fre.fr': 'free.fr'
};

/**
 * Validates email address format and detects common domain typos politely.
 */
export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: true }; // Empty is allowed if optional
  }

  // Check presence of @
  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount === 0) {
    return {
      isValid: false,
      error: "Il manque le @ dans ton adresse e-mail."
    };
  }

  if (atCount > 1) {
    return {
      isValid: false,
      error: "Ton adresse e-mail ne peut comporter qu'un seul symbole @."
    };
  }

  if (trimmed.includes(' ')) {
    return {
      isValid: false,
      error: "Une adresse e-mail ne doit pas contenir d'espaces."
    };
  }

  const [username, domain] = trimmed.split('@');

  if (!username) {
    return {
      isValid: false,
      error: "Indique la partie avant le @ (ex. : jean.dupont)."
    };
  }

  if (!domain) {
    return {
      isValid: false,
      error: "Indique le domaine après l'arobase (ex. : @gmail.com)."
    };
  }

  const domainLower = domain.toLowerCase();

  // Check for common typo suggestions
  if (COMMON_DOMAIN_TYPOS[domainLower]) {
    const suggestedDomain = COMMON_DOMAIN_TYPOS[domainLower];
    const fixedEmail = `${username}@${suggestedDomain}`;
    return {
      isValid: false,
      error: `Petite faute de frappe probable : voulais-tu écrire @${suggestedDomain} ?`,
      suggestion: {
        typoDomain: domain,
        suggestedDomain,
        fixedEmail
      }
    };
  }

  // Check for dot in domain
  if (!domainLower.includes('.')) {
    return {
      isValid: false,
      error: "Il manque l'extension après le domaine (ex. : .com, .fr, .bj)."
    };
  }

  const domainParts = domainLower.split('.');
  const tld = domainParts[domainParts.length - 1];

  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      error: "L'extension de domaine semble incomplète (ex. : .com, .fr)."
    };
  }

  // General regex for RFC 5322 approximation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Format d'adresse e-mail incomplet ou incorrect."
    };
  }

  return { isValid: true };
}

/**
 * Validates international or local phone numbers.
 * Accepts numbers with or without international prefix (+229, +33, 00..., etc.),
 * with or without spaces, dots, dashes, parentheses.
 * NEVER requires a specific national format.
 */
export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: true }; // Optional if empty
  }

  // Check for invalid letters or prohibited characters
  // Allowed: digits, +, -, ., /, (, ), and spaces
  const forbiddenCharsRegex = /[^0-9+\-\.\s\/\(\)]/;
  if (forbiddenCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Le numéro ne doit comporter que des chiffres (avec d'éventuels +, -, espaces ou parenthèses)."
    };
  }

  // If '+' is present, it must be the very first character
  if (trimmed.indexOf('+') > 0) {
    return {
      isValid: false,
      error: "L'indicatif (+) doit se trouver au tout début du numéro."
    };
  }

  // If multiple '+' exist
  if ((trimmed.match(/\+/g) || []).length > 1) {
    return {
      isValid: false,
      error: "Le symbole (+) ne doit apparaître qu'une seule fois."
    };
  }

  // Count total digits
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (digitsOnly.length < 6) {
    return {
      isValid: false,
      error: "Ce numéro semble trop court (au moins 6 chiffres)."
    };
  }

  if (digitsOnly.length > 16) {
    return {
      isValid: false,
      error: "Ce numéro comporte trop de chiffres (maximum 15 à 16 chiffres)."
    };
  }

  return { isValid: true };
}

/**
 * Validates full name field (mandatory)
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: "Indique au moins ton prénom et ton nom pour identifier ton CV."
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: "Le nom indiqué est trop court (au moins 2 lettres)."
    };
  }

  // Check if it consists only of numbers/special characters
  if (/^[\d\W_]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: "Indique ton prénom et nom avec de vraies lettres."
    };
  }

  return { isValid: true };
}

/**
 * Validates education field (mandatory)
 */
export function validateEducation(education: string): ValidationResult {
  const trimmed = education.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: "Indique au moins un diplôme, une formation ou ta classe actuelle."
    };
  }

  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Précise l'intitulé de ta formation ou de ton diplôme."
    };
  }

  return { isValid: true };
}
