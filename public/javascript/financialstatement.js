const currentAssetItem = document.querySelector(".current-asset-item");
const currentAssetAmount = document.querySelector(".current-asset-amount");
const currentAssetPercent = document.querySelector(".current-asset-percent");
const totalCurrentAssetAmount = document.querySelector(".total-current-asset-amount");
const totalCurrentAssetPercent = document.querySelector(".total-current-asset-percent");
const nonCurrentAssetItem = document.querySelector(".non-current-asset-item");
const nonCurrentAssetAmount = document.querySelector(".non-current-asset-amount");
const nonCurrentAssetPercent = document.querySelector(".non-current-asset-percent");
const totalNonCurrentAssetAmount = document.querySelector(".total-non-current-asset-amount");
const totalNonCurrentAssetPercent = document.querySelector(".total-non-current-asset-percent");
const totalAssetAmout = document.querySelector(".total-asset-amount");
const totalAssetPercent = document.querySelector(".total-asset-percent");

const currentLiabilityItem = document.querySelector(".current-liability-item");
const currentLiabilityAmount = document.querySelector(".current-liability-amount");
const currentLiabilityPercent = document.querySelector(".current-liability-percent");
const totalCurrentLiabiliyAmount = document.querySelector(".total-current-liability-amount");
const totalCurrentLiabiliyPercent = document.querySelector(".total-current-liability-percent");
const nonCurrentLiabilityItem = document.querySelector(".non-current-liability-item");
const nonCurrentLiabilityAmount = document.querySelector(".non-current-liability-amount");
const nonCurrentLiabilityPercent = document.querySelector(".non-current-liability-percent");
const totalNonCurrentLiabilityAmount = document.querySelector(".total-non-current-liability-amount");
const totalNonCurrentLiabilityPercent = document.querySelector(".total-non-current-liability-percent");
const totalLiabilityAmout = document.querySelector(".total-liability-amount");
const totalLiabilityPercent = document.querySelector(".total-liability-percent");

const netProfitOrLossAmount = document.querySelector(".net-profit-or-loss-amount");
const netProfitOrLossPercent = document.querySelector(".net-profit-or-loss-percent");
const totalEquityAmount = document.querySelector(".total-equity-amount");
const totalEquityPercent = document.querySelector(".total-equity-percent");
const totalLiabilityAndEquityAmount = document.querySelector(".total-liability-and-equity-amount");
const totalLiabilityAndEquityPercent = document.querySelector(".total-liability-and-equity-percent");

const revenueItem = document.querySelector(".revenue-item");
const revenueAmount = document.querySelector(".revenue-amount");
const revenuePercent = document.querySelector(".revenue-percent");
const totalRevenueAmount = document.querySelector(".total-revenue-amount");
const totalRevenuePercent = document.querySelector(".total-revenue-percent");

const expenseItem = document.querySelector(".expense-item");
const expenseAmount = document.querySelector(".expense-amount");
const expensePercent = document.querySelector(".expense-percent");
const totalExpenseAmount = document.querySelector(".total-expense-amount");
const totalExpensePercent = document.querySelector(".total-expense-percent");

const amountBeforeTax = document.querySelector(".amount-before-tax");
const percentBeforeTax = document.querySelector(".percent-before-tax");

const taxItem = document.querySelector(".tax-item");
const taxAmount = document.querySelector(".tax-amount");
const taxPercent = document.querySelector(".tax-percent");

const amountAfterTax = document.querySelector(".amount-after-tax");
const percentAfterTax = document.querySelector(".percent-after-tax");

const BSdate = document.querySelector(".balance-sheet-date");
const ISdate = document.querySelector(".income-statement-date");

// ???????????????
let date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();
if (month < 10) {
    month = "0" + month;
}
let today = year + "-" + month;
document.getElementById("allYear").value = today;

// ??????????????????
const allYear = document.getElementById("allYear");
for (let j = 2020; j < 2100; j++) {
    const option = document.createElement("option");
    option.setAttribute("class", "year");
    option.appendChild(document.createTextNode(j + "???"));
    allYear.appendChild(option);
    allYear.value = year + "???";
}

async function getReport() {
    const allYearValue = document.getElementById("allYear").value;
    let response = await fetch(
        `/api/year/financialstatement?year=${allYearValue}`,
        {
            method: "GET",
        }
    );
    let data = await response.json();
    currentAssetItem.innerHTML = "";
    currentAssetAmount.innerHTML = "";
    currentAssetPercent.innerHTML = "";
    totalCurrentAssetAmount.innerHTML = "";
    totalCurrentAssetPercent.innerHTML = "";
    nonCurrentAssetItem.innerHTML = "";
    nonCurrentAssetAmount.innerHTML = "";
    nonCurrentAssetPercent.innerHTML = "";
    totalNonCurrentAssetAmount.innerHTML = "";
    totalNonCurrentAssetPercent.innerHTML = "";
    totalAssetAmout.innerHTML = "";
    totalAssetPercent.innerHTML = "";

    currentLiabilityItem.innerHTML = "";
    currentLiabilityAmount.innerHTML = "";
    currentLiabilityPercent.innerHTML = "";
    totalCurrentLiabiliyAmount.innerHTML = "";
    totalCurrentLiabiliyPercent.innerHTML = "";
    nonCurrentLiabilityItem.innerHTML = "";
    nonCurrentLiabilityAmount.innerHTML = "";
    nonCurrentLiabilityPercent.innerHTML = "";
    totalNonCurrentLiabilityAmount.innerHTML = "";
    totalNonCurrentLiabilityPercent.innerHTML = "";
    totalLiabilityAmout.innerHTML = "";
    totalLiabilityPercent.innerHTML = "";

    netProfitOrLossAmount.innerHTML = "";
    netProfitOrLossPercent.innerHTML = "";
    totalEquityAmount.innerHTML = "";
    totalEquityPercent.innerHTML = "";
    totalLiabilityAndEquityAmount.innerHTML = "";
    totalLiabilityAndEquityPercent.innerHTML = "";

    revenueItem.innerHTML = "";
    revenueAmount.innerHTML = "";
    revenuePercent.innerHTML = "";
    totalRevenueAmount.innerHTML = "";
    totalRevenuePercent.innerHTML = "";

    expenseItem.innerHTML = "";
    expenseAmount.innerHTML = "";
    expensePercent.innerHTML = "";
    totalExpenseAmount.innerHTML = "";
    totalExpensePercent.innerHTML = "";

    amountBeforeTax.innerHTML = "";
    percentBeforeTax.innerHTML = "";

    taxItem.innerHTML = "";
    taxAmount.innerHTML = "";
    taxPercent.innerHTML = "";

    amountAfterTax.innerHTML = "";
    percentAfterTax.innerHTML = "";

    BSdate.innerHTML = "";
    ISdate.innerHTML = "";

    // ????????????
    const yearNumber = allYearValue.replace("???", "") - 1911;
    const yearValue = `${yearNumber}`;
    const digits = ["???", "???", "???", "???", "???", "???", "???", "???", "???", "???"];
    let searchYearValue = "";
    for (let i = 0; i < yearValue.length; i++) {
      searchYearValue += digits[parseInt(yearValue[i])];
    }
    BSdate.innerHTML = `${searchYearValue}????????????????????????`;
    ISdate.innerHTML = `${searchYearValue}??????`;

    // ????????????%
    let incomeSum = 0;
    let incomeSumPercent = 0;
    if (data.incomeList[0].incomeTotalAmount.length == "") {
        incomeSum = 0;
        incomeSumPercent = 0;
    } else {
        incomeSum = data.incomeList[0].incomeTotalAmount[0].amount;
        incomeSumPercent = 100;
    }

    // ??????????????????/??????
    const eachIncomeCategory = [];
    const eachIncomeAmount = [];

    data.incomeList[0].incomeEachData.forEach((item) => {
        eachIncomeCategory.push(item._id.category[0].category);
        eachIncomeAmount.push(item.amount);
    });

    eachIncomeCategory.forEach((label, index) => {
        const eachIncome = eachIncomeAmount[index];
        const eachIncomePercent = Math.round((eachIncome / incomeSum) * 100) + "%";
        const incomeCategoryDiv = document.createElement("div");
        const incomeAmountDiv = document.createElement("div");
        const incomePercentDiv = document.createElement("div");
        incomeCategoryDiv.innerHTML = label;
        incomeAmountDiv.innerHTML = eachIncome.toLocaleString();
        incomePercentDiv.innerHTML = eachIncomePercent;
        revenueItem.appendChild(incomeCategoryDiv);
        revenueAmount.appendChild(incomeAmountDiv);
        revenuePercent.appendChild(incomePercentDiv);
    });

    // ??????????????????/??????
    const eachCostCategory = [];
    const eachCostAmount = [];

    data.costList[0].costEachData.forEach((item) => {
        eachCostCategory.push(item._id.category[0].category);
        eachCostAmount.push(item.amount);
    });

    let costSum = 0;
    let eachCostPercent = 0;
    let costPercentSum = 0;
    const eachNegativeCost = eachCostAmount.map((num) => -num);
    eachCostCategory.forEach((label, index) => {
        const eachCost = eachNegativeCost[index];
        if (incomeSum === 0) {
            eachCostPercent = 0;
        } else {
            eachCostPercent = Math.round((eachCost / incomeSum) * 100);
        }
        costSum += eachCost;
        costPercentSum += eachCostPercent;
        const costCategoryDiv = document.createElement("div");
        const costAmountDiv = document.createElement("div");
        const eachCostPercentDiv = document.createElement("div");
        costCategoryDiv.innerHTML = label;
        costAmountDiv.innerHTML = eachCost.toLocaleString();
        eachCostPercentDiv.innerHTML = eachCostPercent + "%";
        expenseItem.appendChild(costCategoryDiv);
        expenseAmount.appendChild(costAmountDiv);
        expensePercent.appendChild(eachCostPercentDiv);
    });

    // ???????????????????????????
    const eachIncomeAccountCategory = [];
    const eachIncomeAccountAmount = [];

    data.incomeList[0].assetOrLiability.forEach((item) => {
        eachIncomeAccountCategory.push(item._id.category[0].category);
        eachIncomeAccountAmount.push(item.amount);
    });

    const eachIncomeAsset = [];
    const eachIncomeAssetAmount = [];
    const eachIncomeLiability = [];
    const eachIncomeLiabilityAmount = [];

    // ???????????????+?????????-
    eachIncomeAccountCategory.forEach((key, values) => {
        const negativeIncomeAmount = eachIncomeAccountAmount[values];
        if (key === "????????????" || key === "????????????" || key === "????????????" || key === "???????????????" || key === "???????????????") {
            eachIncomeLiability.push(key);
            eachIncomeLiabilityAmount.push(-negativeIncomeAmount);
        } else {
            eachIncomeAsset.push(key);
            eachIncomeAssetAmount.push(negativeIncomeAmount);
        }
    });

    // ???????????????????????????
    const eachCostAccountCategory = [];
    const eachCostAccountAmount = [];

    data.costList[0].assetOrLiability.forEach((item) => {
        eachCostAccountCategory.push(item._id.category[0].category);
        eachCostAccountAmount.push(item.amount);
    });

    const eachCostAsset = [];
    const eachCostAssetAmount = [];
    const eachCostLiability = [];
    const eachCostLiabilityAmount = [];

    // ???????????????-?????????+
    eachCostAccountCategory.forEach((key, values) => {
        const negativeCostAmount = eachCostAccountAmount[values];
        if (key === "????????????" || key === "????????????" || key === "????????????" || key === "???????????????" || key === "???????????????") {
            eachCostLiability.push(key);
            eachCostLiabilityAmount.push(negativeCostAmount);
        } else {
            eachCostAsset.push(key);
            eachCostAssetAmount.push(-negativeCostAmount);
        }
    });

    // ????????????????????????
    // ???????????????+?????????-
    // ???????????????-?????????+
    const writeOffPayCategory = [];
    const writeOffPayAmount = [];
    const writeOffReceiveCategory = [];
    const writeOffReceiveAmount = [];

    const writeOffPayDebitCategory = [];
    const writeOffPayDebitAmount = [];
    const writeOffPayCreditCategory = [];
    const writeOffPayCreditAmount = [];

    const writeOffReceiveDebitCategory = [];
    const writeOffReceiveDebitAmount = [];
    const writeOffReceiveCreditCategory = [];
    const writeOffReceiveCreditAmount = [];

    data.writeOffList.forEach((item) => {
        writeOffPayCategory.push(item.payId.category);
        writeOffPayAmount.push(item.amount);
        writeOffReceiveCategory.push(item.receiveId.category);
        writeOffReceiveAmount.push(item.amount);
    });

    // ??????
    writeOffPayCategory.forEach((key, values) => {
        const negativewriteOffPayAmount = writeOffPayAmount[values];
        if (key === "????????????" || key === "????????????" || key === "????????????" || key === "???????????????" || key === "???????????????") {
            writeOffPayDebitCategory.push(key);
            writeOffPayDebitAmount.push(-negativewriteOffPayAmount);
        } else {
            writeOffPayCreditCategory.push(key);
            writeOffPayCreditAmount.push(negativewriteOffPayAmount);
        }
    });

    //??????
    writeOffReceiveCategory.forEach((key, values) => {
        const negativewriteOffReceiveAmount = writeOffReceiveAmount[values];
        if (key === "????????????" || key === "????????????" || key === "????????????" || key === "???????????????" || key === "???????????????") {
            writeOffReceiveDebitCategory.push(key);
            writeOffReceiveDebitAmount.push(negativewriteOffReceiveAmount);
        } else {
            writeOffReceiveCreditCategory.push(key);
            writeOffReceiveCreditAmount.push(-negativewriteOffReceiveAmount);
        }
    });

    // ??????????????????????????????
    const incomeTaxCategory = [];
    const incomeTaxAmount = [];
    const incomeTaxPayCategory = [];
    const incomeTaxPayAmount = [];

    data.incomeTaxList.forEach((item) => {
        incomeTaxCategory.push(item.incomeTax);
        incomeTaxAmount.push(item.amount);
        incomeTaxPayCategory.push(item.taxPayId.category);
        incomeTaxPayAmount.push(item.amount);
    });

    const taxExpenseCategory = [];
    const taxExpenseAmount = [];

    incomeTaxCategory.forEach((key, values) => {
        const eachTaxAmount = incomeTaxAmount[values];
        if (key === "???????????????") {
            taxExpenseCategory.push(key);
            taxExpenseAmount.push(-eachTaxAmount);
        } else {
            taxExpenseCategory.push(key);
            taxExpenseAmount.push(eachTaxAmount);
        }
    });

    // ???????????????????????????????????????????????????????????????????????????
    const array = [
        { labels: eachIncomeAsset, amounts: eachIncomeAssetAmount },
        { labels: eachIncomeLiability, amounts: eachIncomeLiabilityAmount },
        { labels: eachCostAsset, amounts: eachCostAssetAmount },
        { labels: eachCostLiability, amounts: eachCostLiabilityAmount },
        { labels: writeOffPayDebitCategory, amounts: writeOffPayDebitAmount },
        { labels: writeOffPayCreditCategory, amounts: writeOffPayCreditAmount },
        { labels: writeOffReceiveDebitCategory, amounts: writeOffReceiveDebitAmount },
        { labels: writeOffReceiveCreditCategory, amounts: writeOffReceiveCreditAmount },
        { labels: incomeTaxPayCategory, amounts: taxExpenseAmount },
        { labels: taxExpenseCategory, amounts: taxExpenseAmount },
    ];

    const result = [];
    array.forEach(({ labels, amounts }) => {
        labels.forEach((account, index) => {
        if (!result[account]) {
            result[account] = 0;
        }
        result[account] += amounts[index];
        });
    });

    // ?????????(???)???????????????(???)???????????????????????????
    let currentAssetSum = 0;
    let nonCurrentAssetSum = 0;
    let currentLiabilitySum = 0;
    let nonCurrentLiabilitySum = 0;
    let totalTaxAmount = 0;
    for (const label in result) {
        const amount = parseInt(result[label]);
        if (label === "????????????" || label === "????????????" || label === "???????????????") {
            currentLiabilityItem.innerHTML += `<div>${label}</div>`;
            currentLiabilityAmount.innerHTML += `<div>${amount.toLocaleString()}</div>`;
            currentLiabilitySum += amount;
        } else if (label === "???????????????" || label === "????????????") {
            nonCurrentLiabilityItem.innerHTML += `<div>${label}</div>`;
            nonCurrentLiabilityAmount.innerHTML += `<div>${amount.toLocaleString()}</div>`;
            nonCurrentLiabilitySum += amount;
        } else if (label === "???????????????") {
            nonCurrentAssetItem.innerHTML += `<div>${label}</div>`;
            nonCurrentAssetAmount.innerHTML += `<div>${amount.toLocaleString()}</div>`;
            nonCurrentAssetSum += amount;
        } else if (label === "???????????????" || label === "???????????????") {
            taxItem.innerHTML += `<div>${label}</div>`;
            taxAmount.innerHTML += `<div>${amount.toLocaleString()}</div>`;
            totalTaxAmount += amount;
        } else {
            currentAssetItem.innerHTML += `<div>${label}</div>`;
            currentAssetAmount.innerHTML += `<div>${amount.toLocaleString()}</div>`;
            currentAssetSum += amount;
        }
    }

    // ????????????
    const beforeTax = parseInt(incomeSum + costSum);
    amountBeforeTax.textContent = beforeTax.toLocaleString();

    // ?????????????????????
    const netProfitLoss = beforeTax + totalTaxAmount;
    const totalLiabilityAndEquity = currentLiabilitySum + nonCurrentLiabilitySum + netProfitLoss;
    totalLiabilityAndEquityAmount.textContent = "$" + totalLiabilityAndEquity.toLocaleString();

    // ??????????????????????????????
    let currentAssetPercentSum = 0;
    let nonCurrentAssetPercentSum = 0;
    let currentLiabilityPercentSum = 0;
    let nonCurrentLiabilityPercentSum = 0;
    let totalTaxPercentSum = 0;
    for (const label in result) {
        const percentages =(currentAssetSum + nonCurrentAssetSum + currentLiabilitySum + nonCurrentLiabilitySum + netProfitLoss) / 2;
        const eachAmount = parseInt(result[label]);
        if (label === "????????????" || label === "????????????" || label === "???????????????") {
            if (percentages === 0) {
                currentLiabilityPercent.innerHTML += `<div>0%</div>`;
                currentLiabilityPercentSum += 0;
            } else {
                currentLiabilityPercent.innerHTML += `<div>${Math.round((eachAmount / percentages) * 100)}%</div>`;
                currentLiabilityPercentSum += Math.round((eachAmount / percentages) * 100);
            }
        } else if (label === "???????????????" || label === "????????????") {
            if (percentages === 0) {
                nonCurrentLiabilityPercent.innerHTML += `<div>0%</div>`;
                nonCurrentLiabilityPercentSum += 0;
            } else {
                nonCurrentLiabilityPercent.innerHTML += `<div>${Math.round((eachAmount / percentages) * 100)}%</div>`;
                nonCurrentLiabilityPercentSum += Math.round((eachAmount / percentages) * 100);
            }
        } else if (label === "???????????????") {
            if (percentages === 0) {
                nonCurrentAssetPercent.innerHTML += `<div>0%</div>`;
                nonCurrentAssetPercentSum += 0;
            } else {
                nonCurrentAssetPercent.innerHTML += `<div>${Math.round((eachAmount / percentages) * 100)}%</div>`;
                nonCurrentAssetPercentSum += Math.round((eachAmount / percentages) * 100);
            }
        } else if (label === "???????????????" || label === "???????????????") {
            if (incomeSum === 0) {
                taxPercent.innerHTML += `<div>0%</div>`;
                totalTaxPercentSum += 0;
            } else {
                taxPercent.innerHTML += `<div>${Math.round((eachAmount / incomeSum) * 100)}%</div>`;
                totalTaxPercentSum += Math.round((eachAmount / incomeSum) * 100);
            }
        } else {
            if (percentages === 0) {
                currentAssetPercent.innerHTML += `<div>0%</div>`;
                currentAssetPercentSum += 0;
            } else {
                currentAssetPercent.innerHTML += `<div>${Math.round((eachAmount / percentages) * 100)}%</div>`;
                currentAssetPercentSum += Math.round((eachAmount / percentages) * 100);
            }
        }
    }

    // ?????????
    let assetPercentSum = 0;
    if (currentAssetSum === 0 && nonCurrentAssetSum === 0) {
        assetPercentSum = 0;
    } else {
        assetPercentSum = 100;
    }

    // ?????????%
    let totalLiabilityPercentSum = 0;
    const totalLiabilitySum = currentLiabilitySum + nonCurrentLiabilitySum;
    if (totalLiabilitySum === 0) {
        totalLiabilityPercentSum = 0;
    } else {
        if (totalLiabilityAndEquity === 0) {
            totalLiabilityPercentSum = 0;
        } else {
            totalLiabilityPercentSum = Math.round((totalLiabilitySum / totalLiabilityAndEquity) * 100);
        }
    }

    // ??????????????????%
    let totalLiabilityAndEquityPercentSum = 0;
    if (totalLiabilityAndEquity === 0) {
        totalLiabilityAndEquityPercentSum = 0;
    } else {
        totalLiabilityAndEquityPercentSum = 100;
    }

    // ????????????%
    let netProfitOrLossPercentSum = 0;
    if (netProfitLoss === 0) {
        netProfitOrLossPercentSum = 0;
    } else {
        if (totalLiabilityAndEquity === 0) {
            netProfitOrLossPercentSum = 0;
        } else {
            netProfitOrLossPercentSum = Math.round((netProfitLoss / (currentLiabilitySum + nonCurrentLiabilitySum + netProfitLoss)) * 100);
        }
    }

    // ?????????%
    totalCurrentAssetAmount.textContent = currentAssetSum.toLocaleString();
    totalCurrentAssetPercent.textContent = currentAssetPercentSum + "%";
    totalNonCurrentAssetAmount.textContent = nonCurrentAssetSum.toLocaleString();
    totalNonCurrentAssetPercent.textContent = nonCurrentAssetPercentSum + "%";
    totalAssetAmout.textContent = "$" + (currentAssetSum + nonCurrentAssetSum).toLocaleString();
    totalAssetPercent.textContent = assetPercentSum + "%";

    // ?????????%
    totalCurrentLiabiliyAmount.textContent = currentLiabilitySum.toLocaleString();
    totalCurrentLiabiliyPercent.textContent = currentLiabilityPercentSum + "%";
    totalNonCurrentLiabilityAmount.textContent = nonCurrentLiabilitySum.toLocaleString();
    totalNonCurrentLiabilityPercent.textContent = nonCurrentLiabilityPercentSum + "%";
    totalLiabilityAmout.textContent = (currentLiabilitySum + nonCurrentLiabilitySum).toLocaleString();
    totalLiabilityPercent.textContent = totalLiabilityPercentSum + "%";

    // ?????????%
    netProfitOrLossAmount.textContent = netProfitLoss.toLocaleString();
    netProfitOrLossPercent.textContent = netProfitOrLossPercentSum + "%";
    totalEquityAmount.textContent = netProfitLoss.toLocaleString();
    totalEquityPercent.textContent = netProfitOrLossPercentSum + "%";
    totalLiabilityAndEquityPercent.textContent = totalLiabilityAndEquityPercentSum + "%";

    // ???????????????????????????????????????%
    totalRevenueAmount.textContent = incomeSum.toLocaleString();
    totalRevenuePercent.textContent = incomeSumPercent + "%";
    totalExpenseAmount.textContent = costSum.toLocaleString();
    totalExpensePercent.textContent = costPercentSum + "%";
    percentBeforeTax.textContent = incomeSumPercent + costPercentSum + "%";
    amountAfterTax.textContent = "$" + netProfitLoss.toLocaleString();
    percentAfterTax.textContent = incomeSumPercent + costPercentSum + totalTaxPercentSum + "%";
};

const submit = document.getElementById("submit");
submit.addEventListener("click", getReport);