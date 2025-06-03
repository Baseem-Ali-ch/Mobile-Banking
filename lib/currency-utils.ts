import { store } from "@/store/store"

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  CNY: "¥",
  SAR: "﷼",
}

/**
 * Format a number or string as currency
 * @param value Number or string to format
 * @param currencyOverride Optional currency code to override the default
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string, currencyOverride?: string): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) || 0 : value

  // Get the current currency from the Redux store or use the override
  const currency = currencyOverride || store.getState().settings.currency || "USD"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: "symbol",
  })
    .format(numValue)
    .replace(/^(\D+)/, "$1 ")
    .trim()
}

/**
 * Get the symbol for a currency code
 * @param currencyCode The currency code (e.g., "USD")
 * @returns The currency symbol (e.g., "$")
 */
export function getCurrencySymbol(currencyCode?: string): string {
  const currency = currencyCode || store.getState().settings.currency || "USD"
  return currencySymbols[currency] || currency
}

/**
 * Parse a currency string to a number
 * @param value Currency string to parse
 * @returns Parsed number
 */
export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^0-9.]/g, "")

  // Parse the cleaned value to a float
  const numValue = Number.parseFloat(cleanValue)

  // Return 0 if parsing fails
  return isNaN(numValue) ? 0 : numValue
}
