// Postgres: 23503 = foreign_key_violation, 23001 = restrict_violation.
const FK_PG_CODES = new Set(["23503", "23001"]);

/**
 * True when a delete/insert was rejected by a foreign key. Prisma reports this
 * as P2003, but with the pg driver adapter it arrives as a DriverAdapterError
 * carrying the raw Postgres code on `cause.originalCode`.
 */
export function isForeignKeyError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  const { code, cause } = error as {
    code?: string;
    cause?: { originalCode?: string };
  };
  return (
    code === "P2003" ||
    (cause?.originalCode !== undefined && FK_PG_CODES.has(cause.originalCode))
  );
}
