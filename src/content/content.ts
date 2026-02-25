if (window.location.href.includes("/foodtracker/") || window.location.href.includes("foodtracker")) {
    let attempts = 0;
    const checkExist = setInterval(() => {
        const elements = document.querySelectorAll('[data-qa*="receipt"]');
        attempts++;
        if (elements.length > 0) {

            let peopleDivs = getPersonsElementsFromHTML()
            clearInterval(checkExist);
            let blikAmountsList:number[] = [];
            let summaryArray: any  = [];
            summaryArray.push(namePicker());
            summaryArray.push(getSumsForPersons())
            summaryArray.push(getEachCostFromSummary())
            let pysznePayList:any[] = Array(summaryArray[0].length).fill(25);




            let fontsize = "18px"

            peopleDivs.htmlElement.forEach((item,index) => {

                const extensionWrapper = document.createElement("div");
                extensionWrapper.style.padding = "10px";

                const productSummaryDiv = document.createElement("div");
                let summaryValue = summaryArray[1][index].toFixed(2);
                productSummaryDiv.innerHTML = `Łączna wartość 🍔 to: ` + `<strong>${summaryValue} zł <\strong>`
                productSummaryDiv.style.fontSize = fontsize
                productSummaryDiv.style.marginBottom = "10px";

                const pysznePayDiv = document.createElement("div");
                pysznePayDiv.style.display = "flex";
                pysznePayDiv.style.marginBottom = "10px";


                const textDiv = document.createElement("div");
                textDiv.innerHTML = `PysznePay:`
                textDiv.style.paddingTop = "8px";
                textDiv.style.paddingRight = "5px";
                textDiv.style.fontSize = fontsize;

                const pysznePayAmount = document.createElement("input");
                pysznePayAmount.type = "number";
                pysznePayAmount.min = "0";
                pysznePayAmount.step = "0.01";
                pysznePayAmount.value = "25";
                pysznePayAmount.style.fontSize = fontsize;
                pysznePayAmount.style.marginRight = "10px";

                const pysznepayButton = document.createElement("button");
                pysznepayButton.textContent = "Zapisz"
                pysznepayButton.style.color = "#fff";
                pysznepayButton.style.fontFamily = "Arial, sans-serif";
                pysznepayButton.style.fontWeight = "bold";
                pysznepayButton.style.padding = "5px 12px"
                pysznepayButton.style.borderColor = "#fff";
                pysznepayButton.onmouseover = () => {
                    pysznepayButton.style.backgroundColor = "#d65c04"
                }
                pysznepayButton.onmouseout = () => {
                    pysznepayButton.style.borderColor = "#f36805";
                }
                pysznepayButton.style.backgroundColor = "#f36805";
                pysznepayButton.style.alignContent = "center";
                pysznepayButton.style.borderRadius = "50px";
                pysznepayButton.style.fontSize = fontsize;

                pysznepayButton.onclick = () => {
                    const newValue = pysznePayAmount.value;
                    pysznePayList[index] = parseFloat(newValue);

                    const blikAmount = (summaryArray[1][index] + costPerPerson - pysznePayList[index]).toFixed(2)
                    blikAmountDiv.innerHTML = `Do przelania 💸 : `+`<strong>${blikAmount} zł<\strong>`
                    blikAmountsList[index] = parseFloat(blikAmount);
                    validateCalculation(summaryArray);
                }


                pysznePayDiv.appendChild(textDiv);
                pysznePayDiv.append(pysznePayAmount);
                pysznePayDiv.append(pysznepayButton);


                const splitCostDiv = document.createElement("div");
                let costPerPerson:number = (summaryArray[2].slice(1, summaryArray[2].length-1).reduce((a:number, b:number) => a + b, 0))/summaryArray[0].length
                splitCostDiv.innerHTML = `Kurier 🚲 + Koszty💰: ` + `<strong>${costPerPerson.toFixed(2)} zł<\strong>`
                splitCostDiv.style.fontSize = String(fontsize);
                splitCostDiv.style.fontSize = fontsize;
                splitCostDiv.style.marginBottom = "10px";


                const blikAmountDiv = document.createElement("div");
                const value = (summaryArray[1][index] + costPerPerson - pysznePayList[index])
                const blikAmount = value >= 0 ? value.toFixed(2) : "0"
                blikAmountDiv.innerHTML = `Do przelania 💸 : `+`<strong>${blikAmount} zł<\strong>`
                blikAmountsList.push(parseFloat(blikAmount));
                blikAmountDiv.style.fontSize = fontsize;
                blikAmountDiv.style.marginBottom = "5px";



                extensionWrapper.classList.add("extension-wrapper");
                extensionWrapper.append(productSummaryDiv);
                extensionWrapper.append(pysznePayDiv);
                extensionWrapper.append(splitCostDiv);
                extensionWrapper.append(blikAmountDiv);
                item.append(extensionWrapper);

            })
            summaryArray.push(blikAmountsList);



            const receiptBottom = document.querySelector('[data-qa="receipt"] [data-qa="list"]');

            const mobilePhoneDivWrapper = document.createElement("div");
            mobilePhoneDivWrapper.style.display = "flex";
            mobilePhoneDivWrapper.style.margin = "30px 10px 10px 0px";
            mobilePhoneDivWrapper.style.paddingTop = "10px"
            mobilePhoneDivWrapper.style.width = "100%";
            mobilePhoneDivWrapper.style.borderTop = "1px solid #ebebeb";

            const textMobilePhoneDiv = document.createElement("div");
            textMobilePhoneDiv.innerHTML = `Wprowadź numer telefonu do przelewu :`
            textMobilePhoneDiv.style.paddingTop = "8px";
            textMobilePhoneDiv.style.paddingRight = "5px";
            textMobilePhoneDiv.style.marginLeft = "15px";
            textMobilePhoneDiv.style.fontSize = "15px";

            const mobilePhoneNumberInput = document.createElement("input");
            mobilePhoneNumberInput.type = "number";
            mobilePhoneNumberInput.min = "0";
            mobilePhoneNumberInput.step = "0.01";

            let phoneNumberFromLS = localStorage.getItem("phoneNumber");
            if (phoneNumberFromLS) {
                mobilePhoneNumberInput.placeholder = phoneNumberFromLS;
            }
            else{
                mobilePhoneNumberInput.placeholder = "Numer telefonu";

            }


            mobilePhoneNumberInput.style.fontSize = "18px";
            mobilePhoneNumberInput.style.marginRight = "10px";
            mobilePhoneNumberInput.style.marginTop = "5px";



            const mobilePhoneNumberButton = document.createElement("button");
            mobilePhoneNumberButton.textContent = "Zapisz"
            mobilePhoneNumberButton.style.color = "#fff";
            mobilePhoneNumberButton.style.fontFamily = "Arial, sans-serif";
            mobilePhoneNumberButton.style.fontWeight = "bold";
            mobilePhoneNumberButton.style.padding = "2px 14px"
            mobilePhoneNumberButton.style.borderColor = "#fff";
            mobilePhoneNumberButton.onmouseover = () => {
                mobilePhoneNumberButton.style.backgroundColor = "#d65c04"
            }
            mobilePhoneNumberButton.onmouseout = () => {
                mobilePhoneNumberButton.style.borderColor = "#f36805";
            }
            mobilePhoneNumberButton.style.backgroundColor = "#f36805";
            mobilePhoneNumberButton.style.alignContent = "center";
            mobilePhoneNumberButton.style.borderRadius = "50px";
            mobilePhoneNumberButton.style.fontSize = fontsize;

            mobilePhoneNumberButton.onclick = () => {
                phoneNumberSetter(mobilePhoneNumberInput.value);

            }

            mobilePhoneDivWrapper.appendChild(textMobilePhoneDiv);
            mobilePhoneDivWrapper.appendChild(mobilePhoneNumberInput);
            mobilePhoneDivWrapper.appendChild(mobilePhoneNumberButton);
            receiptBottom?.appendChild(mobilePhoneDivWrapper)

            let copyButtonDiv = document.createElement("div");
            copyButtonDiv.style.display = "flex";
            copyButtonDiv.style.width = "100%";
            copyButtonDiv.style.paddingTop = "8px";
            copyButtonDiv.style.paddingBottom = "15px";
            copyButtonDiv.style.alignItems = "center";
            copyButtonDiv.style.justifyContent = "center";

            let copyButton = document.createElement("button");
            copyButton.textContent = "Skopiuj podsumowanie 🧾 "
            copyButton.style.color = "#fff";
            copyButton.style.fontFamily = "Arial, sans-serif";
            copyButton.style.fontWeight = "bold";
            copyButton.style.padding = "5px 20px"
            copyButton.style.borderColor = "#fff";
            copyButton.style.backgroundColor = "#f36805";
            copyButton.onmouseover = () => {
                copyButton.style.backgroundColor = "#d65c04"
            }
            copyButton.onmouseout = () => {
                copyButton.style.borderColor = "#f36805";
            }
            copyButton.style.alignContent = "center";
            copyButton.style.borderRadius = "50px";
            copyButton.style.fontSize = fontsize;
            copyButton.onclick = () => {
                let finalString = "";

                if (phoneNumberFromLS != null) {
                    finalString +=`BLIK na numer : ${phoneNumberFromLS}\n\n`
                }
                else{
                    finalString +=`"Ustaw swój numer telefonu!"\n\n`
                }
                let i = 1;

                for (i; i < summaryArray[0].length; i++){
                    console.log(summaryArray[0][i]);
                    finalString += `${summaryArray[0][i]} : ${summaryArray[3][i]} zł \n`;
                }

                navigator.clipboard.writeText(finalString);
                console.log(summaryArray);

            }


            copyButtonDiv.appendChild(copyButton);
            receiptBottom?.appendChild(copyButtonDiv);
            console.log(summaryArray)
            validateCalculation(summaryArray);

        } else if (attempts > 100) {
            console.log("Przekroczono czas oczekiwania.");
            clearInterval(checkExist);
        }
    }, 100);
}



//This function gathers all persons food costs, and sums them up.
//As a return it is 1 dim array in order presented on site
function getSumsForPersons() {
    let persons = getPersonsElementsFromHTML();
    let summarisedOrder = 0;
    let resultslist: number[]=[];

    persons.htmlElement.forEach((item) => {
        summarisedOrder = 0;
        item.querySelectorAll('[class^="formatted-currency-style_content"]').forEach((product) => {
            let orderValue = priceHelper(product.innerHTML);
            summarisedOrder += orderValue;
        })
        resultslist.push(summarisedOrder);
    })
    return resultslist;
}


//This function gets the HTML elements of the persons, so we can work only on these, without caring about entire DOM
function getPersonsElementsFromHTML() {
    const allPersons = document.querySelectorAll('[data-qa="receipt"] [data-qa="box"] > div:nth-of-type(2) > div > [data-qa="util"]')
    return {
        htmlElement: allPersons,
    }
}


function validateCalculation(summaryArray: any) {
    let pyszneFinalCost = 0;
    const pyszneFinalCostHTML = document.querySelectorAll('[data-qa^="payment-info-total-amount"] [class^="formatted-currency"]');
    pyszneFinalCostHTML.forEach((product) => {
        pyszneFinalCost = priceHelper(product.innerHTML);
    })

    let calculatedFinalCost:number = (summaryArray[3].reduce((a:number, b:number) => a + b, 0))
    //console.log(calculatedFinalCost)
    const diff = Math.abs(calculatedFinalCost - pyszneFinalCost);


    if (diff > 0.1) {
        pyszneFinalCostHTML.forEach((product) => {
            const cleanHTML = product.innerHTML.split(/[❌✅\(]/)[0].trim();
            product.setAttribute('style', 'color: red');
            product.innerHTML = `${cleanHTML} ❌ (${calculatedFinalCost.toFixed(2)})`
        })

    } else {
        pyszneFinalCostHTML.forEach((product) => {
            const cleanHTML = product.innerHTML.split(/[❌✅\(]/)[0].trim();
            product.setAttribute('style', 'color: green');
            product.innerHTML = `${cleanHTML} ✅ (${calculatedFinalCost.toFixed(2)})`
        })

    }

}

//function collects prices visible in the summary, beginning always with the order summary, and following by order costs PysznePay deduction etc.
function getEachCostFromSummary() {
    const sumList: number[] = [];
    const paymentSummary = document.querySelectorAll('[data-qa^="list-item-element"] [data-qa*="util"] [data-qa*="flex"] div:nth-of-type(2) span');
    if(paymentSummary.length > 0) {
        paymentSummary.forEach((item) => {
            let value = item.innerHTML;
            sumList.push(priceHelper(value));
        });
        //console.log(sumList);
        return sumList;
    }
    else {
        console.log("No data has been found - Cost summary")
    }

}

function phoneNumberSetter(text: string) {
        localStorage.setItem("phoneNumber", text);
}

//This function gathers the names of the persons included in the order
function namePicker() {
    let persons = getPersonsElementsFromHTML()
    let namelist: string[] = []
    persons.htmlElement.forEach((item) => {
        item.querySelectorAll('[data-qa="participant-name"]').forEach((name) => {
            namelist.push(name.innerHTML);
            //console.log(namelist)
        })

    })
    return namelist;
}

//Helper function to get rid of the currency within HTML elements of prices
function priceHelper(value: string){
    if(value == "Za darmo"){
        value = "0"
    }else{
        value = value.replace("&nbsp;zł","");
        value = value.replace(",",".");
    }
    return parseFloat(value);
}

