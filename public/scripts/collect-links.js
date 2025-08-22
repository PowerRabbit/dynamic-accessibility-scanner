(() => {

    const collectLinks = () => {
        return Array.from(document.body.querySelectorAll('a')).map((a) => {
            return a.href;
        })
    };

    if (window.dynamicAccessibilityScannerLinksCollector) {
        console.warn('Scanner UI is already set!');
    } else {
        window.dynamicAccessibilityScannerLinksCollector = {
            collectLinks,
        }
    }

})();