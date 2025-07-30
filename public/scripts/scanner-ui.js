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
        padding: 10px;
    `;

    const transformViolations = (violations) => {

        return violations.map(v => {
            v.nodes = v.nodes.map(n => {
                return n.target.length < 2 ? document.querySelector(n.target[0]) : n.target.map(t => document.querySelector(t));
            })
            return v;
        })
    }

    const scan = async () => {
        const { incomplete, violations } = await window.axe.run();
        console.log('---Violations---');
        console.log(transformViolations(violations));
        console.log('---Incomplete---');
        console.log(transformViolations(incomplete));
    }

    const showUi = () => {
        const scanButton = document.createElement('button');

        scanButton.addEventListener('click', scan);
        scanButton.innerText = 'Scan this Page (results in console)';
        scanButton.style = scanButtonStyles;

        document.documentElement.appendChild(scanButton);
    };

    const bindKeys = () => {
        document.documentElement.addEventListener('keyup', async (e) => {
            if (e.altKey && e.key === 't') {
                await scan();
                setTimeout(() => {
                    debugger;
                });
            }
        })
    };

    if (window.dynamicAccessibilityScanner) {
        console.warn('Scanner UI is already set!');
    } else {
        window.dynamicAccessibilityScanner = {
            init: () => {
                showUi();
                bindKeys();
            }
        }
    }

})();