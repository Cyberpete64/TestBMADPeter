const handicapFormatter = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function normalizeHandicapInput(value: string) {
  const sanitized = value.replace(/\./g, ",").replace(/[^\d,]/g, "");
  const [wholePart = "", ...decimalParts] = sanitized.split(",");

  if (decimalParts.length === 0) {
    return wholePart;
  }

  const decimalPart = decimalParts.join("").slice(0, 1);
  return `${wholePart},${decimalPart}`;
}

export function parseHandicapInput(value: string) {
  return Number(value.replace(",", "."));
}

export function isValidHandicapInput(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return false;
  }

  const parsedValue = parseHandicapInput(trimmedValue);
  return !Number.isNaN(parsedValue) && parsedValue >= 0;
}

export function formatHandicapValue(value: number) {
  return handicapFormatter.format(value);
}

export function formatHandicapDelta(value: number) {
  if (value === 0) {
    return "0,0";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatHandicapValue(value)}`;
}
