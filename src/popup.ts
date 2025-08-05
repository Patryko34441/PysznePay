document.getElementById("export")?.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0].id) return;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                alert("Zamówienie zostało wyeksportowane (placeholder)!");
                // tu później dodasz kod zbierający dane
            }
        });
    });
});