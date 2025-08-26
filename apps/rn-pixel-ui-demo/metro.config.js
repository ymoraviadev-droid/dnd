// apps/rn-pixel-ui-demo/metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
// adjust if your monorepo structure differs:
const pkgRoot = path.resolve(projectRoot, "../../packages/rn-pixel-ui");

const config = getDefaultConfig(projectRoot);

// 1) Make Metro watch your package folder (so edits trigger HMR)
config.watchFolders = [pkgRoot];

// 2) Resolve modules correctly from the app first, then monorepo root if needed
config.resolver.nodeModulesPaths = [
    path.join(projectRoot, "node_modules"),
    path.join(projectRoot, "../../node_modules"),
];

// 3) Enable symlink support (important for pnpm workspaces)
config.resolver.unstable_enableSymlinks = true;

// 4) (Optional but helpful in monorepos)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
