/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // serverModuleFormat: "esm",
  /*serverDependenciesToBundle: ["react-markdown", "micromark", "vfile", 
   "vfile-message",
   "unified", "remark-parse", "property-information", 
   "unist-util-stringify-position", "remark-rehype", 
   "unist-util-visit", "mdast-util-from-markdown", "bail", 
   "hast-util-whitespace", "space-separated-tokens", "trough", 
   "comma-separated-tokens", "unist-util-stringify-position", 
   "mdast-util-to-hast", "unist-util-visit-parents", "mdast-util-to-string",
  "micromark-util-decode-numeric-character-reference",
   "micromark-util-decode-string", "micromark-util-normalize-identifier",
   "decode-named-character-reference", "unist-util-is",
   "unist-util-position", "unist-util-generated", "micromark-util-sanitize-uri",
   "mdast-util-definitions", "character-entities", "trim-lines", 
   "micromark-util-character", "micromark-util-encode"],*/
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
