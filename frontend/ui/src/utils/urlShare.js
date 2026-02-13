
export const generateShareUrl = (state) => {
    try {
        const json = JSON.stringify(state);
        // Handle unicode strings safely
        const encoded = btoa(unescape(encodeURIComponent(json)));
        return `${window.location.origin}/#share=${encoded}`;
    } catch (e) {
        console.error("Error generating share URL", e);
        return null;
    }
};

export const parseShareUrl = () => {
    try {
        const hash = window.location.hash;
        if (!hash.includes('#share=')) return null;

        const encoded = hash.split('#share=')[1];
        const decoded = decodeURIComponent(escape(atob(encoded)));

        return JSON.parse(decoded);
    } catch (e) {
        console.error("Error parsing share URL", e);
        return null;
    }
};
