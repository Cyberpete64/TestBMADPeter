const primaryCourseDisplayName = "\u00d6stersund-Fr\u00f6s\u00f6 Golfklubb";
const primaryCourseShortLabel = "\u00d6fg";

export const primaryCourse = {
  slug: "ofg",
  displayName: "Östersund-Frösö Golfklubb",
  shortLabel: "Öfg",
};

primaryCourse.displayName = primaryCourseDisplayName;
primaryCourse.shortLabel = primaryCourseShortLabel;

export const availableTees = [
  { code: "yellow", label: "Yellow tee" },
  { code: "red", label: "Red tee" },
] as const;

export type TeeCode = (typeof availableTees)[number]["code"];

export type HoleReference = {
  holeNumber: number;
  par: number;
  strokeIndex: number;
  distanceMeters: number;
};

// Hole references seeded from the current Östersund-Frösö Golfklubb scorecard.
// Yellow/red tee mapping is based on the club setup plus the Golfify scorecard
// listing for the course as checked on March 23, 2026.
const yellowTeeHoleLayout: HoleReference[] = [
  { holeNumber: 1, par: 5, strokeIndex: 13, distanceMeters: 500 },
  { holeNumber: 2, par: 4, strokeIndex: 1, distanceMeters: 328 },
  { holeNumber: 3, par: 5, strokeIndex: 11, distanceMeters: 525 },
  { holeNumber: 4, par: 3, strokeIndex: 17, distanceMeters: 120 },
  { holeNumber: 5, par: 4, strokeIndex: 7, distanceMeters: 354 },
  { holeNumber: 6, par: 4, strokeIndex: 3, distanceMeters: 341 },
  { holeNumber: 7, par: 3, strokeIndex: 5, distanceMeters: 156 },
  { holeNumber: 8, par: 5, strokeIndex: 15, distanceMeters: 448 },
  { holeNumber: 9, par: 4, strokeIndex: 9, distanceMeters: 290 },
  { holeNumber: 10, par: 4, strokeIndex: 12, distanceMeters: 343 },
  { holeNumber: 11, par: 4, strokeIndex: 2, distanceMeters: 374 },
  { holeNumber: 12, par: 5, strokeIndex: 18, distanceMeters: 469 },
  { holeNumber: 13, par: 4, strokeIndex: 14, distanceMeters: 279 },
  { holeNumber: 14, par: 3, strokeIndex: 4, distanceMeters: 166 },
  { holeNumber: 15, par: 5, strokeIndex: 16, distanceMeters: 457 },
  { holeNumber: 16, par: 4, strokeIndex: 10, distanceMeters: 345 },
  { holeNumber: 17, par: 3, strokeIndex: 6, distanceMeters: 139 },
  { holeNumber: 18, par: 4, strokeIndex: 8, distanceMeters: 328 },
];

const redTeeHoleLayout: HoleReference[] = [
  { holeNumber: 1, par: 5, strokeIndex: 13, distanceMeters: 441 },
  { holeNumber: 2, par: 4, strokeIndex: 1, distanceMeters: 278 },
  { holeNumber: 3, par: 5, strokeIndex: 11, distanceMeters: 428 },
  { holeNumber: 4, par: 3, strokeIndex: 17, distanceMeters: 95 },
  { holeNumber: 5, par: 4, strokeIndex: 7, distanceMeters: 287 },
  { holeNumber: 6, par: 4, strokeIndex: 3, distanceMeters: 283 },
  { holeNumber: 7, par: 3, strokeIndex: 5, distanceMeters: 135 },
  { holeNumber: 8, par: 5, strokeIndex: 15, distanceMeters: 358 },
  { holeNumber: 9, par: 4, strokeIndex: 9, distanceMeters: 238 },
  { holeNumber: 10, par: 4, strokeIndex: 12, distanceMeters: 290 },
  { holeNumber: 11, par: 4, strokeIndex: 2, distanceMeters: 320 },
  { holeNumber: 12, par: 5, strokeIndex: 18, distanceMeters: 403 },
  { holeNumber: 13, par: 4, strokeIndex: 14, distanceMeters: 228 },
  { holeNumber: 14, par: 3, strokeIndex: 4, distanceMeters: 90 },
  { holeNumber: 15, par: 5, strokeIndex: 16, distanceMeters: 378 },
  { holeNumber: 16, par: 4, strokeIndex: 10, distanceMeters: 315 },
  { holeNumber: 17, par: 3, strokeIndex: 6, distanceMeters: 83 },
  { holeNumber: 18, par: 4, strokeIndex: 8, distanceMeters: 272 },
];

export function getHoleReferencesForTee(teeCode: TeeCode): HoleReference[] {
  if (teeCode === "red") {
    return redTeeHoleLayout;
  }

  return yellowTeeHoleLayout;
}
