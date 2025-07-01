(() => {

    const scanButtonStyles = `
        color: white;
        background: black;
        border: 3px dashed white;
        position: fixed;
        left: 20px;
        top: 20px;
        font-size: 20px;
        z-index: 2147483647;
    `;

    const scan = async () => {
        const results = await window.axe.run();

        console.log(results);
    }

    const showUi = () => {
        const scanButton = document.createElement('button');

        scanButton.addEventListener('click', scan);
        scanButton.innerText = 'Scan this Page (results in console)';
        scanButton.style = scanButtonStyles;

        document.documentElement.appendChild(scanButton);
    };

    if (window.dynamicAccessibilityScanner) {
        console.warn('Scanner UI is already set!');
    } else {
        window.dynamicAccessibilityScanner = {
            init: () => {
                showUi();
            }
        }
    }

})();