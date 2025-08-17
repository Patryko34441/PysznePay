"use strict";
if (window.location.href.includes("/foodtracker/") || window.location.href.includes("foodtracker")) {
    const userAmounts = {};
    const observer = new MutationObserver(() => {
        const peopleDivs = document.querySelectorAll('[data-qa="participant-name"]');
        if (peopleDivs.length > 0) {
            observer.disconnect();
            const totalAmount = getTotalAmount();
            console.log("Total amount:", totalAmount);
            if (totalAmount === 0) {
                const section = document.querySelector('[data-qa^="payment-info-payment-method-info"]');
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
            console.log("Delivery:", deliveryCost);
            console.log("Service charge:", serviceCharge);
            console.log("Discount:", discount);
            console.log("Voucher:", voucher);
            console.log("People count:", peopleCount);
            console.log("Shared cost per person:", sharedCost);
            peopleDivs.forEach((person, index) => {
                var _a, _b, _c, _d, _e;
                const name = ((_a = person.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "Nieznane";
                const userBlock = (_b = person.closest('div[data-qa="util"]')) === null || _b === void 0 ? void 0 : _b.parentElement;
                if (!userBlock)
                    return;
                const items = userBlock.querySelectorAll('li[data-qa="list-item"]');
                let total = 0;
                items.forEach(item => {
                    var _a, _b, _c, _d;
                    const quantityText = ((_b = (_a = item.querySelector('.item-style_quantity-text__jlSnT span')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "1";
                    const quantity = parseInt(quantityText) || 1;
                    const priceText = ((_d = (_c = item.querySelector('[data-qa="item-details-product-price"]')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.replace("zł", "").replace(",", ".").trim()) || "0";
                    const price = parseFloat(priceText) || 0;
                    total += price * quantity;
                });
                if (items.length > 0) {
                    const totalRounded = total.toFixed(2);
                    const sharedRounded = sharedCost.toFixed(2);
                    const combined = (total + sharedCost).toFixed(2);
                    const inputWrapper = document.createElement("div");
                    inputWrapper.style.marginTop = "4px";
                    inputWrapper.style.display = "flex";
                    inputWrapper.style.alignItems = "center";
                    inputWrapper.style.gap = "8px";
                    const label = document.createElement("span");
                    label.textContent = "PysznePay:";
                    label.style.fontSize = "14px";
                    label.style.fontWeight = "500";
                    label.style.color = "#333";
                    const input = document.createElement("input");
                    input.type = "number";
                    input.min = "0";
                    input.step = "0.01";
                    input.placeholder = "Wpłata";
                    // @ts-ignore
                    input.value = userAmounts[name] !== undefined ? userAmounts[name] : 25;
                    input.style.width = "72px";
                    input.style.padding = "4px 8px";
                    input.style.border = "1px solid #ccc";
                    input.style.borderRadius = "4px";
                    input.style.fontSize = "14px";
                    const button = document.createElement("button");
                    button.textContent = "Zapisz";
                    button.style.padding = "6px 10px";
                    button.style.cursor = "pointer";
                    button.style.fontSize = "13px";
                    button.style.background = "#000";
                    button.style.color = "#fff";
                    button.style.border = "none";
                    button.style.borderRadius = "4px";
                    const payInfo = document.createElement("div");
                    payInfo.style.marginTop = "4px";
                    payInfo.style.color = "#444";
                    payInfo.style.fontWeight = "bold";
                    payInfo.style.fontSize = "15px";
                    payInfo.style.lineHeight = "1.4";
                    const updatePayText = () => {
                        const paid = parseFloat(input.value) || 0;
                        const toPay = (total + sharedCost - paid).toFixed(2);
                        payInfo.textContent = `💵 Do przelania: ${toPay} zł`;
                    };
                    button.onclick = () => {
                        // @ts-ignore
                        userAmounts[name] = parseFloat(input.value) || 0;
                        updatePayText();
                    };
                    updatePayText();
                    const sumElement = document.createElement("div");
                    sumElement.style.marginTop = "10px";
                    sumElement.style.fontWeight = "bold";
                    sumElement.style.color = "#000";
                    sumElement.style.fontSize = "16px";
                    sumElement.style.lineHeight = "1.4";
                    sumElement.textContent = `💰 Suma dla ${name}: ${totalRounded} zł + ${sharedRounded} zł (koszty) = ${combined} zł`;
                    inputWrapper.appendChild(label);
                    inputWrapper.appendChild(input);
                    inputWrapper.appendChild(button);
                    const lastItem = items[items.length - 1];
                    (_c = lastItem.parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(sumElement);
                    (_d = lastItem.parentElement) === null || _d === void 0 ? void 0 : _d.appendChild(inputWrapper);
                    (_e = lastItem.parentElement) === null || _e === void 0 ? void 0 : _e.appendChild(payInfo);
                }
            });
            mountPhoneInput();
            mountCopyButton();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    function getServiceCharge() {
        const labelSpan = document.querySelector('[data-qa="payment-info-service-charge-text"]');
        const container = labelSpan === null || labelSpan === void 0 ? void 0 : labelSpan.closest('[data-qa="flex"]');
        const amountSpan = container === null || container === void 0 ? void 0 : container.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = (amountSpan === null || amountSpan === void 0 ? void 0 : amountSpan.textContent) || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }
    function getDeliveryCost() {
        const labelSpan = document.querySelector('[data-qa="payment-info-delivery-cost-text"]');
        const container = labelSpan === null || labelSpan === void 0 ? void 0 : labelSpan.closest('[data-qa="flex"]');
        const amountSpan = container === null || container === void 0 ? void 0 : container.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = (amountSpan === null || amountSpan === void 0 ? void 0 : amountSpan.textContent) || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }
    function getDiscount() {
        const labelSpan = document.querySelector('[data-qa="payment-info-discount-text"]');
        const container = labelSpan === null || labelSpan === void 0 ? void 0 : labelSpan.closest('[data-qa="flex"]');
        const amountSpan = container === null || container === void 0 ? void 0 : container.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = (amountSpan === null || amountSpan === void 0 ? void 0 : amountSpan.textContent) || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }
    function getVoucher() {
        const labelSpan = document.querySelector('[data-qa="payment-info-voucher-text"]');
        const container = labelSpan === null || labelSpan === void 0 ? void 0 : labelSpan.closest('[data-qa="flex"]');
        const amountSpan = container === null || container === void 0 ? void 0 : container.querySelector('span[class^="formatted-currency-style_content"]');
        const raw = (amountSpan === null || amountSpan === void 0 ? void 0 : amountSpan.textContent) || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }
    function getTotalAmount() {
        const amountSpan = document.querySelector('[data-qa="payment-info-total-amount"] span[class^="formatted-currency-style_content"]');
        const raw = (amountSpan === null || amountSpan === void 0 ? void 0 : amountSpan.textContent) || "0";
        return parseFloat(raw.replace("zł", "").replace(",", ".").replace(/\s/g, "")) || 0;
    }
    function copySummaryToClipboard() {
        const match = document.cookie.match(/(?:^|; )pysznePhone=([^;]*)/);
        const people = document.querySelectorAll('[data-qa="participant-name"]');
        const lines = [];
        people.forEach((el, index) => {
            var _a, _b;
            if (index === 0)
                return;
            const name = ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || `Osoba ${index}`;
            const container = (_b = el.closest("div[data-qa='util']")) === null || _b === void 0 ? void 0 : _b.parentElement;
            const allDivs = (container === null || container === void 0 ? void 0 : container.querySelectorAll("div")) || [];
            let amount = "0,00";
            allDivs.forEach(div => {
                var _a;
                const match = (_a = div.textContent) === null || _a === void 0 ? void 0 : _a.match(/Do przelania: ([\d,.]+) zł/);
                if (match)
                    amount = match[1].replace(".", ",");
            });
            lines.push(`${name} - ${amount} zł`);
        });
        lines.push("");
        const configuredPhone = localStorage.getItem("pysznePhone") || "Ustaw numer!";
        lines.push(`Na numer - ${configuredPhone}`);
        navigator.clipboard.writeText(lines.join("\n"));
    }
    function mountCopyButton() {
        const section = document.querySelector('[data-qa^="payment-info-payment-method-info"]');
        if (!section || section.querySelector("#pyszne-copy-button"))
            return;
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
}
function mountPhoneInput() {
    const section = document.querySelector('[data-qa^="payment-info-payment-method-info"]');
    if (!section || section.querySelector("#pyszne-phone-wrapper"))
        return;
    const wrapper = document.createElement("div");
    wrapper.id = "pyszne-phone-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";
    wrapper.style.marginTop = "20px";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Numer telefonu";
    input.style.padding = "8px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "6px";
    input.style.fontSize = "14px";
    input.style.flex = "1";
    // Odczytaj z localStorage
    const saved = localStorage.getItem("pysznePhone");
    if (saved) {
        input.value = saved;
    }
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Zapisz";
    saveBtn.style.padding = "8px 14px";
    saveBtn.style.fontSize = "14px";
    saveBtn.style.fontWeight = "bold";
    saveBtn.style.background = "#000";
    saveBtn.style.color = "#fff";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "6px";
    saveBtn.style.cursor = "pointer";
    saveBtn.addEventListener("click", () => {
        const phone = input.value.trim();
        if (phone) {
            localStorage.setItem("pysznePhone", phone);
            alert("📱 Numer zapisany!");
        }
    });
    wrapper.appendChild(input);
    wrapper.appendChild(saveBtn);
    section.appendChild(wrapper);
}
