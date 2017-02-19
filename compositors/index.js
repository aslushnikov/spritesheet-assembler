module.exports = {
    'image/svg+xml': require('./SVGCompositor'),
    'image/png': require('./GMCompositor'),
    'image/jpeg': require('./GMCompositor'),
};
