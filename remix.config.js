/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  // Configure for Vercel deployment
  ...(process.env.VERCEL && {
    serverBuildPath: 'api/index.js',
    serverConditions: ['workerd', 'worker', 'browser'],
    serverDependenciesToBundle: [
      'react-dom/server',
      '@remix-run/node',
      /^(?!node:)/,
    ],
    serverMainFields: ['browser', 'module', 'main'],
    serverMinify: true,
    serverModuleFormat: 'cjs', // Use CommonJS for Vercel compatibility
    serverPlatform: 'node',
  }),
};
