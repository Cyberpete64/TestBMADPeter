const passwordSymbolPattern = /[^A-Za-z0-9]/;

export const passwordPolicy = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSymbol: true,
} as const;

export function validatePasswordAgainstPolicy(password: string) {
  const errors: string[] = [];

  if (password.length < passwordPolicy.minLength) {
    errors.push(`minst ${passwordPolicy.minLength} tecken`);
  }

  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("minst en liten bokstav");
  }

  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("minst en stor bokstav");
  }

  if (passwordPolicy.requireNumber && !/[0-9]/.test(password)) {
    errors.push("minst en siffra");
  }

  if (passwordPolicy.requireSymbol && !passwordSymbolPattern.test(password)) {
    errors.push("minst ett specialtecken");
  }

  return errors;
}

export function getPasswordPolicyHint() {
  const rules = [
    `minst ${passwordPolicy.minLength} tecken`,
    passwordPolicy.requireLowercase ? "en liten bokstav" : null,
    passwordPolicy.requireUppercase ? "en stor bokstav" : null,
    passwordPolicy.requireNumber ? "en siffra" : null,
    passwordPolicy.requireSymbol ? "ett specialtecken" : null,
  ].filter(Boolean);

  return `Lösenordet måste innehålla ${rules.join(", ")}.`;
}
