// @patricksurry/g3 is a UMD bundle with no bundled types, and d3-scale (its own
// dependency, which we use for the gauge's measure scale) ships no types either.
// Declare them loosely so the untyped g3 builder chain type-checks.
declare module '@patricksurry/g3/dist/g3.js';
declare module '@patricksurry/g3/dist/g3-contrib.js';
declare module 'd3-scale';
