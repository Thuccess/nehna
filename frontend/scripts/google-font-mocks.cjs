/** Proxy mock responses so `next build` works without Google Fonts network access. */
const mockCss =
  '@font-face{font-family:MockFont;src:local("Arial");font-display:swap}';

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop === 'string' && prop.includes('fonts.googleapis.com')) {
        return mockCss;
      }
      return undefined;
    },
  },
);
