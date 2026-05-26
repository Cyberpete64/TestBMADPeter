import type { GeoPoint } from "@/lib/geo-distance";

const primaryCourseDisplayName = "\u00d6stersund-Fr\u00f6s\u00f6 Golfklubb";
const primaryCourseShortLabel = "\u00d6fg";

export const primaryCourse = {
  slug: "ofg",
  displayName: primaryCourseDisplayName,
  shortLabel: primaryCourseShortLabel,
};

export const availableTees = [
  { code: "yellow", label: "Gul tee" },
  { code: "red", label: "R\u00f6d tee" },
] as const;

export type TeeCode = (typeof availableTees)[number]["code"];

export type GreenTarget = {
  front: GeoPoint;
  center: GeoPoint;
  back: GeoPoint;
};

export type HoleReference = {
  holeNumber: number;
  par: number;
  strokeIndex: number;
  distanceMeters: number;
  green: GreenTarget;
};

// Hole references seeded from the current Ostersund-Froso Golfklubb scorecard.
// Green target coordinates are GolfTraxx hole-layout placemarks checked May 26, 2026.
const greenTargetsByHole: Record<number, GreenTarget> = {
  1: {
    front: { latitude: 63.1811974666, longitude: 14.4888347729 },
    center: { latitude: 63.1811443418, longitude: 14.488646542 },
    back: { latitude: 63.1810863766, longitude: 14.4883885737 },
  },
  2: {
    front: { latitude: 63.1840037512, longitude: 14.4911061277 },
    center: { latitude: 63.1840547008, longitude: 14.4912075754 },
    back: { latitude: 63.1841008106, longitude: 14.4913036586 },
  },
  3: {
    front: { latitude: 63.1804074889, longitude: 14.4858498629 },
    center: { latitude: 63.1803011129, longitude: 14.4857930602 },
    back: { latitude: 63.1801935266, longitude: 14.4857228465 },
  },
  4: {
    front: { latitude: 63.180379774, longitude: 14.4833911421 },
    center: { latitude: 63.1803109143, longitude: 14.4832726486 },
    back: { latitude: 63.1802420548, longitude: 14.4831461085 },
  },
  5: {
    front: { latitude: 63.1771400943, longitude: 14.4882494875 },
    center: { latitude: 63.1770458002, longitude: 14.4883965327 },
    back: { latitude: 63.1769732917, longitude: 14.4885274847 },
  },
  6: {
    front: { latitude: 63.1795195618, longitude: 14.4900165869 },
    center: { latitude: 63.1796080234, longitude: 14.4901073058 },
    back: { latitude: 63.1797025359, longitude: 14.4902248467 },
  },
  7: {
    front: { latitude: 63.1797689795, longitude: 14.4873821814 },
    center: { latitude: 63.179758205, longitude: 14.4871322597 },
    back: { latitude: 63.1797365389, longitude: 14.4867991895 },
  },
  8: {
    front: { latitude: 63.1814560568, longitude: 14.4934810485 },
    center: { latitude: 63.1815057937, longitude: 14.4937943907 },
    back: { latitude: 63.1815470599, longitude: 14.4940996862 },
  },
  9: {
    front: { latitude: 63.1830317155, longitude: 14.4964792819 },
    center: { latitude: 63.1830887143, longitude: 14.4965244032 },
    back: { latitude: 63.1831590237, longitude: 14.4965802533 },
  },
  10: {
    front: { latitude: 63.1791557705, longitude: 14.4979754783 },
    center: { latitude: 63.179063909, longitude: 14.4980554683 },
    back: { latitude: 63.1789756781, longitude: 14.4981488693 },
  },
  11: {
    front: { latitude: 63.1802995199, longitude: 14.4921921594 },
    center: { latitude: 63.180283906, longitude: 14.4918725003 },
    back: { latitude: 63.180265872, longitude: 14.491590392 },
  },
  12: {
    front: { latitude: 63.1760927787, longitude: 14.4920602549 },
    center: { latitude: 63.1759766919, longitude: 14.4920570964 },
    back: { latitude: 63.1758351874, longitude: 14.4920619846 },
  },
  13: {
    front: { latitude: 63.1776699242, longitude: 14.4957102651 },
    center: { latitude: 63.1776978718, longitude: 14.4958251238 },
    back: { latitude: 63.177723399, longitude: 14.4959480292 },
  },
  14: {
    front: { latitude: 63.1784337125, longitude: 14.4981157303 },
    center: { latitude: 63.1784701336, longitude: 14.4983620173 },
    back: { latitude: 63.1784992934, longitude: 14.4985841644 },
  },
  15: {
    front: { latitude: 63.1826355055, longitude: 14.4970289594 },
    center: { latitude: 63.182722756, longitude: 14.4969721568 },
    back: { latitude: 63.182837838, longitude: 14.4968938965 },
  },
  16: {
    front: { latitude: 63.1803303495, longitude: 14.5010571611 },
    center: { latitude: 63.1802554374, longitude: 14.5012015241 },
    back: { latitude: 63.1801938373, longitude: 14.5013297939 },
  },
  17: {
    front: { latitude: 63.1814196002, longitude: 14.5005805928 },
    center: { latitude: 63.1814838582, longitude: 14.5004781926 },
    back: { latitude: 63.1815638478, longitude: 14.5003436058 },
  },
  18: {
    front: { latitude: 63.1833352848, longitude: 14.4982828045 },
    center: { latitude: 63.183400754, longitude: 14.4981830865 },
    back: { latitude: 63.1834831638, longitude: 14.4980458176 },
  },
};

function createHoleReference(
  holeNumber: number,
  par: number,
  strokeIndex: number,
  distanceMeters: number,
): HoleReference {
  return {
    holeNumber,
    par,
    strokeIndex,
    distanceMeters,
    green: greenTargetsByHole[holeNumber],
  };
}

const yellowTeeHoleLayout: HoleReference[] = [
  createHoleReference(1, 5, 13, 500),
  createHoleReference(2, 4, 1, 328),
  createHoleReference(3, 5, 11, 525),
  createHoleReference(4, 3, 17, 120),
  createHoleReference(5, 4, 7, 354),
  createHoleReference(6, 4, 3, 341),
  createHoleReference(7, 3, 5, 156),
  createHoleReference(8, 5, 15, 448),
  createHoleReference(9, 4, 9, 290),
  createHoleReference(10, 4, 12, 343),
  createHoleReference(11, 4, 2, 374),
  createHoleReference(12, 5, 18, 469),
  createHoleReference(13, 4, 14, 279),
  createHoleReference(14, 3, 4, 166),
  createHoleReference(15, 5, 16, 457),
  createHoleReference(16, 4, 10, 345),
  createHoleReference(17, 3, 6, 139),
  createHoleReference(18, 4, 8, 328),
];

const redTeeHoleLayout: HoleReference[] = [
  createHoleReference(1, 5, 13, 441),
  createHoleReference(2, 4, 1, 278),
  createHoleReference(3, 5, 11, 428),
  createHoleReference(4, 3, 17, 95),
  createHoleReference(5, 4, 7, 287),
  createHoleReference(6, 4, 3, 283),
  createHoleReference(7, 3, 5, 135),
  createHoleReference(8, 5, 15, 358),
  createHoleReference(9, 4, 9, 238),
  createHoleReference(10, 4, 12, 290),
  createHoleReference(11, 4, 2, 320),
  createHoleReference(12, 5, 18, 403),
  createHoleReference(13, 4, 14, 228),
  createHoleReference(14, 3, 4, 90),
  createHoleReference(15, 5, 16, 378),
  createHoleReference(16, 4, 10, 315),
  createHoleReference(17, 3, 6, 83),
  createHoleReference(18, 4, 8, 272),
];

export function getHoleReferencesForTee(teeCode: TeeCode): HoleReference[] {
  if (teeCode === "red") {
    return redTeeHoleLayout;
  }

  return yellowTeeHoleLayout;
}
