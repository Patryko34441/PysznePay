if (window.location.href.includes("/foodtracker/")) {
    const observer = new MutationObserver(() => {
        const peopleDivs = document.querySelectorAll('[data-qa="participant-name"]');

        if (peopleDivs.length > 0) {
            observer.disconnect();

            const totalAmount = getTotalAmount();
            console.log("Total amount:", totalAmount);
            if (totalAmount === 0) {
                const section = document.querySelector('[data-qa*="receipt"]');
                if (section) {
                    const msg = document.createElement("div");
                    msg.style.marginTop = "16px";
                    msg.style.fontWeight = "bold";
                    msg.style.fontSize = "16px";
                    msg.textContent = "ℹ️ Całkowita wartość zamówienia wynosi 0 zł – nie trzeba nic przelewać.";
                    section.appendChild(msg);
                }
                return;
            }

            const deliveryCost = getDeliveryCost();
            const serviceCharge = getServiceCharge();
            const discount = getDiscount();
            const voucher = getVoucher();
            const peopleCount = peopleDivs.length;
            const sharedTotal = deliveryCost + serviceCharge + discount + voucher;
            const sharedCost = sharedTotal / peopleCount;

            /*console.log("Delivery:", deliveryCost);
            console.log("Service charge:", serviceCharge);
            console.log("Discount:", discount);
            console.log("Voucher:", voucher);
            console.log("People count:", peopleCount);
            console.log("Shared cost per person:", sharedCost);*/

            peopleDivs.forEach((person, index) => {
                const name = person.textContent?.trim() || "Nieznane";
                const userBlock = person.closest('div[data-qa="util"]')?.parentElement;
                if (!userBlock) return;

                const items = userBlock.querySelectorAll('li[data-qa="list-item"]');
                let total = 0;
                items.forEach(item => {
                    const quantityText = item.querySelector('.item-style_quantity-text__jlSnT span')?.textContent?.trim() || "1";
                    const quantity = parseInt(quantityText) || 1;
                    const priceText = item.querySelector('[data-qa="item-details-product-price"]')?.textContent?.replace("zł", "").replace(",", ".").trim() || "0";
                    const price = parseFloat(priceText) || 0;
                    total += price * quantity;
                });

                if (items.length > 0) {
                    const totalRounded = total.toFixed(2);
                    const sharedRounded = sharedCost.toFixed(2);
                    const combined = (total + sharedCost).toFixed(2);
                    const toPay = (total + sharedCost - 25).toFixed(2);

                    const sumElement = document.createElement("div");
                    sumElement.style.marginTop = "10px";
                    sumElement.style.fontWeight = "bold";
                    sumElement.style.color = "#000";
                    sumElement.style.fontSize = "16px";
                    sumElement.style.lineHeight = "1.4";
                    sumElement.textContent = `💰 Suma dla ${name}: ${totalRounded} zł + ${sharedRounded} zł (koszty) = ${combined} zł`;

                    const payElement = document.createElement("div");
                    payElement.style.marginTop = "4px";
                    payElement.style.color = "#444";
                    payElement.style.fontWeight = "bold";
                    payElement.style.fontSize = "16px";
                    payElement.style.lineHeight = "1.4";
                    payElement.textContent = `💵 Do przelania: ${toPay} zł`;

                    const lastItem = items[items.length - 1];
                    lastItem.parentElement?.appendChild(sumElement);
                    lastItem.parentElement?.appendChild(payElement);
                }
            });

            mountCopyButton();
        }
    });

    function getServiceCharge() {
        const labelSpan = document.querySelector('[data-qa="payment-info-service-charge-text"]');
        const container = labelSpan?.closest('[data-qa="flex"]');
        const amountSpan = container?.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = amountSpan?.textContent || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }

    function getDeliveryCost() {
        const labelSpan = document.querySelector('[data-qa="payment-info-delivery-cost-text"]');
        const container = labelSpan?.closest('[data-qa="flex"]');
        const amountSpan = container?.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = amountSpan?.textContent || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }

    function getDiscount() {
        const labelSpan = document.querySelector('[data-qa="payment-info-discount-text"]');
        const container = labelSpan?.closest('[data-qa="flex"]');
        const amountSpan = container?.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = amountSpan?.textContent || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }

    function getVoucher() {
        const labelSpan = document.querySelector('[data-qa="payment-info-voucher-text"]');
        const container = labelSpan?.closest('[data-qa="flex"]');
        const amountSpan = container?.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = amountSpan?.textContent || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }

    function getTotalAmount() {
        const amountSpan = document.querySelector('[data-qa="payment-info-total-amount"] span[class^="formatted-currency-style_content"]');
        const raw = amountSpan?.textContent || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }

    function copySummaryToClipboard() {
        const people = document.querySelectorAll('[data-qa="participant-name"]');
        const lines = [];

        people.forEach((el, index) => {
            if (index === 0) return;
            const name = el.textContent?.trim() || `Osoba ${index}`;
            const container = el.closest("div[data-qa='util']")?.parentElement;
            const allDivs = container?.querySelectorAll("div") || [];

            let amount = "0,00";
            allDivs.forEach(div => {
                const match = div.textContent?.match(/Do przelania: ([\d,.]+) zł/);
                if (match) amount = match[1].replace(".", ",");
            });

            lines.push(`${name} - ${amount} zł`);
        });

        const phoneNumber = "123456789";
        lines.push("");
        lines.push(`Na numer - ${phoneNumber}`);

        navigator.clipboard.writeText(lines.join("\n"));
    }

    function mountCopyButton() {
        const section = document.querySelector('[data-qa^="payment-info-payment-method-info"]');
        if (!section || section.querySelector("#pyszne-copy-button")) return;

        const copyButton = document.createElement("button");
        copyButton.id = "pyszne-copy-button";
        copyButton.innerText = "📋 Skopiuj podsumowanie";
        copyButton.style.padding = "10px 16px";
        copyButton.style.marginTop = "20px";
        copyButton.style.background = "#000";
        copyButton.style.color = "#fff";
        copyButton.style.border = "none";
        copyButton.style.borderRadius = "8px";
        copyButton.style.cursor = "pointer";
        copyButton.style.fontSize = "14px";

        copyButton.addEventListener("click", copySummaryToClipboard);
        section.appendChild(copyButton);
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}