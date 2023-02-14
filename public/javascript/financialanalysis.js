const assets = document.querySelector(".assets");
const profiAndLoss = document.querySelector(".profiAndLoss");

const assetsAndLiability = document.querySelector(".assetsAndLiability");
const costAndIncome = document.querySelector(".costAndIncome");

const netAssets = document.querySelector(".netAssets");

const cost = document.querySelector(".cost");
const income = document.querySelector(".income");
const balance = document.querySelector(".balance");

const assetsMonth = document.querySelector(".assets-month");
const assetsYear = document.querySelector(".assets-year");
const months = document.querySelector(".months");
const years = document.querySelector(".years");

const monthCost = document.querySelector(".month-cost");
const yearCost = document.querySelector(".year-cost");
const monthIncome = document.querySelector(".month-income");
const yearIncome = document.querySelector(".year-income");
const monthNet = document.querySelector(".month-net");
const yearNet = document.querySelector(".year-net");
const monthAssetsNet = document.querySelector(".assets-month-net");
const yearAssetsNet = document.querySelector(".assets-year-net");

const totalCost = document.querySelector(".totalCost");
const totalIncome = document.querySelector(".totalIncome");
const net = document.querySelector(".net");
const allNetAssets = document.querySelector(".net-assets");

const detailList = document.querySelector(".detailList");

window.onload = function () {
    cost.style.backgroundColor = "yellow";
    months.style.backgroundColor = "yellow";
    profiAndLoss.style.backgroundColor = "yellow";
};

// 默認本月份
let date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();
if (month < 10) {
  month = "0" + month;
}
let today = year + "-" + month;
document.getElementById("costMonth").value = today;
document.getElementById("incomeMonth").value = today;
document.getElementById("netMonth").value = today;
document.getElementById("assetsNetMonth").value = today;

// 支出年份選單
const selectCostYear = document.getElementById("selectCostYear");
for (let j = 2020; j < 2100; j++) {
    const option = document.createElement("option");
    option.setAttribute("class", "year");
    option.appendChild(document.createTextNode(j + "年"));
    selectCostYear.appendChild(option);
    document.getElementById("selectCostYear").value = year + "年";
}

// 收入年份選單
const selectIncomeYear = document.getElementById("selectIncomeYear");
for (let j = 2020; j < 2100; j++) {
    const option = document.createElement("option");
    option.setAttribute("class", "year");
    option.appendChild(document.createTextNode(j + "年"));
    selectIncomeYear.appendChild(option);
    document.getElementById("selectIncomeYear").value = year + "年";
}

// 結餘年份選單
const selectNetYear = document.getElementById("selectNetYear");
for (let j = 2020; j < 2100; j++) {
    const option = document.createElement("option");
    option.setAttribute("class", "year");
    option.appendChild(document.createTextNode(j + "年"));
    selectNetYear.appendChild(option);
    document.getElementById("selectNetYear").value = year + "年";
}

// 淨資產年份選單
const selectAssetsNetYear = document.getElementById("selectAssetsNetYear");
for (let j = 2020; j < 2100; j++) {
    const option = document.createElement("option");
    option.setAttribute("class", "year");
    option.appendChild(document.createTextNode(j + "年"));
    selectAssetsNetYear.appendChild(option);
    document.getElementById("selectAssetsNetYear").value = year + "年";
}

// 支出顏色
const doughnutCostColor = [
    "#67001D",
    "#880027",
    "#A10C37",
    "#C02E59",
    "#D44470",
    "#E35E88",
    "#F2789F",
    "#F599B7",
    "#FABED2",
];

// 收入顏色
const doughnutIncomeColor = [
    "#55979B",
    "#71C9CE",
    "#A6E3E9",
    "#CBF1F5",
    "#E3FDFD",
];

// 結餘顏色
const doughnutNetColor = [
    "#FABED2",
    "#CBF1F5",
];

// 淨資產顏色
const doughnutNetAssetsColor = [
    "#001D4A",
    "#006992",
];

// 移除甜甜圈
function removeDoughnut() {
    const allchart = document.getElementById("allchart");
    const ctx = document.getElementById("myChart");
    allchart.removeChild(ctx);
}

// 畫甜甜圈
function getDoughnut(categories, amounts, color) {
    removeDoughnut();
    const allchart = document.getElementById("allchart");
    const canvas = document.createElement("canvas");
    canvas.id = "myChart";
    allchart.appendChild(canvas);
    new Chart(myChart, {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [
                {
                    data: amounts,
                    backgroundColor: color,
                    hoverOffset: 4,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    position: "right",
                },
            },
        },
    });
}

// 月支出
async function costMonthList() {
    const costMonth = document.getElementById("costMonth").value;
    let response = await fetch(`/financialanalysis/api/monthly/cost?month=${costMonth}`,{
        method: "GET",
    });
    let records = await response.json();
    return records;
}

costMonthList().then((records) => {
    const formattedDate = costMonth.value.replace("-", "年");
    totalCost.textContent = formattedDate + "月總支出 $" + records.totalCost.toLocaleString();
    let str = "";
    const aggregatedCostData = [];
    for (let i = 0; i < records.data.length; i++) {
        const createDate = records.data[i].createdAt.replace(/-/g, "/");
        str += `<div><span class="detailcreatedAt">${createDate}</span>
        <span class="detailCategory">${records.data[i].categoryId.category}</span>
        <span class="detailAmount"> $${records.data[i].amount.toLocaleString()}</span>
        <a href="property/editcost/${records.data[i]._id}"><button class="btn">支出明細</button></a>
        </div>`;
        detailList.innerHTML = str;
        const label = records.data[i].categoryId.category;
        const value = records.data[i].amount;
        if (!aggregatedCostData[label]) {
        aggregatedCostData[label] = 0;
        }
        aggregatedCostData[label] += value;
    }

    const labels = Object.keys(aggregatedCostData);
    const values = Object.values(aggregatedCostData);
    const costLabels = labels.map(
        (label, index) =>
        `${label} ${Math.round((values[index] / records.totalCost) * 100)}%`
    );

    getDoughnut(costLabels, values, doughnutCostColor);
});

// 篩選月支出
async function chooseCostMonthList() {
    const costMonth = document.getElementById("costMonth").value;
    let response = await fetch(`/financialanalysis/api/monthly/cost?month=${costMonth}`,{
        method: "GET",
    });
    let records = await response.json();

    const formattedDate = costMonth.replace("-", "年");
    totalCost.textContent = formattedDate + "月總支出 $" + records.totalCost.toLocaleString();
    detailList.innerHTML = "";
    let str = "";
    const aggregatedCostData = [];
    for (let i = 0; i < records.data.length; i++) {
        const createDate = records.data[i].createdAt.replace(/-/g, "/");
        str += `<div><span class="detailcreatedAt">${createDate}</span>
        <span class="detailCategory">${records.data[i].categoryId.category}</span>
        <span class="detailAmount"> $${records.data[i].amount.toLocaleString()}</span>
        <a href="property/editcost/${records.data[i]._id}"><button class="btn">支出明細</button></a>
        </div>`;
        detailList.innerHTML = str;
        const label = records.data[i].categoryId.category;
        const value = records.data[i].amount;
        if (!aggregatedCostData[label]) {
            aggregatedCostData[label] = 0;
        }
        aggregatedCostData[label] += value;
    }

    const labels = Object.keys(aggregatedCostData);
    const values = Object.values(aggregatedCostData);
    const costLabels = labels.map(
        (label, index) =>
        `${label} ${Math.round((values[index] / records.totalCost) * 100)}%`
    );

    getDoughnut(costLabels, values, doughnutCostColor);
}

const submitCostMonth = document.getElementById("submitCostMonth");
submitCostMonth.addEventListener("click", chooseCostMonthList);

// 篩選月收入
async function chooseIncomeMonthList() {
    const incomeMonth = document.getElementById("incomeMonth").value;
    let response = await fetch(`/financialanalysis/api/monthly/income?month=${incomeMonth}`,{
        method: "GET",
    });
    let records = await response.json();

    const formattedDate = incomeMonth.replace("-", "年");
    totalIncome.textContent = formattedDate + "月總收入 $" + records.totalIncome.toLocaleString();
    detailList.innerHTML = "";
    let str = "";
    const aggregatedIncomeData = [];
    for (let i = 0; i < records.data.length; i++) {
        const createDate = records.data[i].createdAt.replace(/-/g, "/");
        str += `<div><span class="detailcreatedAt">${createDate}</span>
        <span class="detailCategory">${records.data[i].categoryId.category}</span>
        <span class="detailAmount"> $${records.data[i].amount.toLocaleString()}</span>
        <a href="property/editcost/${records.data[i]._id}"><button class="btn">收入明細</button></a>
        </div>`;
        detailList.innerHTML = str;
        const label = records.data[i].categoryId.category;
        const value = records.data[i].amount;
        if (!aggregatedIncomeData[label]) {
            aggregatedIncomeData[label] = 0;
        }
        aggregatedIncomeData[label] += value;
    }

    const labels = Object.keys(aggregatedIncomeData);
    const values = Object.values(aggregatedIncomeData);
    const incomeLabels = labels.map(
        (label, index) =>
        `${label} ${Math.round((values[index] / records.totalIncome) * 100)}%`
    );

    getDoughnut(incomeLabels, values, doughnutIncomeColor);
}

const submitIncomeMonth = document.getElementById("submitIncomeMonth");
submitIncomeMonth.addEventListener("click", chooseIncomeMonthList);

// 年支出
async function costYearList() {
    const selectCostYear = document.getElementById("selectCostYear").value;
    let response = await fetch(`/financialanalysis/api/yearly/cost?year=${selectCostYear}`,{
        method: "GET",
    });
    let records = await response.json();

    totalCost.textContent = selectCostYear + "總支出 $" + records.totalCost.toLocaleString();
    detailList.innerHTML = "";
    let str = "";
    const aggregatedCostData = [];
    for (let i = 0; i < records.data.length; i++) {
        const createDate = records.data[i].createdAt.replace(/-/g, "/");
        str += `<div><span class="detailcreatedAt">${createDate}</span>
        <span class="detailCategory">${records.data[i].categoryId.category}</span>
        <span class="detailAmount"> $${records.data[i].amount.toLocaleString()}</span>
        <a href="property/editcost/${records.data[i]._id}"><button class="btn">支出明細</button></a>
        </div>`;
        detailList.innerHTML = str;
        const label = records.data[i].categoryId.category;
        const value = records.data[i].amount;
        if (!aggregatedCostData[label]) {
            aggregatedCostData[label] = 0;
        }
        aggregatedCostData[label] += value;
    }

    const labels = Object.keys(aggregatedCostData);
    const values = Object.values(aggregatedCostData);
    const costLabels = labels.map(
        (label, index) =>
        `${label} ${Math.round((values[index] / records.totalCost) * 100)}%`
    );

    getDoughnut(costLabels, values, doughnutCostColor);
}

const submitCostYear = document.getElementById("submitCostYear");
submitCostYear.addEventListener("click", costYearList);

// 年收入
async function incomeYearList() {
    const selectIncomeYear = document.getElementById("selectIncomeYear").value;
    let response = await fetch(`/financialanalysis/api/yearly/income?year=${selectIncomeYear}`,{
        method: "GET",
    });
    let records = await response.json();

    totalIncome.textContent = selectIncomeYear + "總收入 $" + records.totalIncome.toLocaleString();
    detailList.innerHTML = "";
    let str = "";
    const aggregatedIncomeData = [];
    for (let i = 0; i < records.data.length; i++) {
        const createDate = records.data[i].createdAt.replace(/-/g, "/");
        str += `<div><span class="detailcreatedAt">${createDate}</span>
        <span class="detailCategory">${records.data[i].categoryId.category}</span>
        <span class="detailAmount"> $${records.data[i].amount.toLocaleString()}</span>
        <a href="property/editcost/${records.data[i]._id}"><button class="btn">收入明細</button></a>
        </div>`;
        detailList.innerHTML = str;
        const label = records.data[i].categoryId.category;
        const value = records.data[i].amount;
        if (!aggregatedIncomeData[label]) {
            aggregatedIncomeData[label] = 0;
        }
        aggregatedIncomeData[label] += value;
    }

    const labels = Object.keys(aggregatedIncomeData);
    const values = Object.values(aggregatedIncomeData);
    const incomeLabels = labels.map(
        (label, index) =>
        `${label} ${Math.round((values[index] / records.totalIncome) * 100)}%`
    );

    getDoughnut(incomeLabels, values, doughnutIncomeColor);
}

const submitIncomeYear = document.getElementById("submitIncomeYear");
submitIncomeYear.addEventListener("click", incomeYearList);


// 月結餘
async function monthlyNetIncome() {
    const netMonth = document.getElementById("netMonth").value;
    let response = await fetch(`/financialanalysis/api/monthly/net?month=${netMonth}`,{
        method: "GET",
    });
    let records = await response.json();
    detailList.innerHTML = "";
    let costSum = 0;
    for (let i = 0; i < records.data.costAmountList.length; i++) {
        costSum += records.data.costAmountList[i].amount;
    }

    let incomeSum = 0;
    for (let i = 0; i < records.data.incomeAmountList.length; i++) {
        incomeSum += records.data.incomeAmountList[i].amount;
    }

    const netAmount = incomeSum - costSum;
    const formattedDate = netMonth.replace("-", "年");
    net.textContent = formattedDate + "月結餘 $" + netAmount.toLocaleString();

    const costAndIncome = ["總支出", "總收入"];
    const costAndIncomeAmount = [costSum, incomeSum];

    getDoughnut(costAndIncome, costAndIncomeAmount, doughnutNetColor);
}

const submitNetMonth = document.getElementById("submitNetMonth");
submitNetMonth.addEventListener("click", monthlyNetIncome);

// 年結餘
async function yearlyNetIncome() {
    const selectNetYear = document.getElementById("selectNetYear").value;
    let response = await fetch(`/financialanalysis/api/yearly/net?year=${selectNetYear}`,{
        method: "GET",
    });
    let records = await response.json();
    detailList.innerHTML = "";
    let costSum = 0;
    for (let i = 0; i < records.data.costAmountList.length; i++) {
        costSum += records.data.costAmountList[i].amount;
    }

    let incomeSum = 0;
    for (let i = 0; i < records.data.incomeAmountList.length; i++) {
        incomeSum += records.data.incomeAmountList[i].amount;
    }

    const netAmount = incomeSum - costSum;
    net.textContent = selectNetYear + "結餘 $" + netAmount.toLocaleString();

    const costAndIncome = ["總支出", "總收入"];
    const costAndIncomeAmount = [costSum, incomeSum];

    getDoughnut(costAndIncome, costAndIncomeAmount, doughnutNetColor);
}

const submitNetYear = document.getElementById("submitNetYear");
submitNetYear.addEventListener("click", yearlyNetIncome);

// 月淨資產
async function monthlyNetAssets() {
    const assetsNetMonth = document.getElementById("assetsNetMonth").value;
    let response = await fetch(`/financialanalysis/api/monthly/net?month=${assetsNetMonth}`,{
        method: "GET",
    });
    let records = await response.json();
    detailList.innerHTML = "";
    let payCash = 0;
    let payBank = 0;
    let receiveCash = 0;
    let receiveBank = 0;
    for (let i = 0; i < records.data.costAmountList.length; i++) {
        if (records.data.costAmountList[i].pay === "現金") {
            payCash += records.data.costAmountList[i].amount;
        }
        if (records.data.costAmountList[i].pay === "銀行存款") {
            payBank += records.data.costAmountList[i].amount;
        }
    }
    for (let i = 0; i < records.data.incomeAmountList.length; i++) {
        if (records.data.incomeAmountList[i].receive === "現金") {
            receiveCash += records.data.incomeAmountList[i].amount;
        }
        if (records.data.incomeAmountList[i].receive === "銀行存款") {
            receiveBank += records.data.incomeAmountList[i].amount;
        }
    }

    const netCash = receiveCash - payCash;
    const netBank = receiveBank - payBank;
    const netAssetsAmount = netCash + netBank;
    const formattedDate = assetsNetMonth.replace("-", "年");
    allNetAssets.textContent = formattedDate + "月淨資產 $" + netAssetsAmount.toLocaleString();

    const costAndIncome = ["現金", "銀行存款"];
    const costAndIncomeAmount = [netCash, netBank];

    getDoughnut(costAndIncome, costAndIncomeAmount, doughnutNetAssetsColor);
}

const submitAssetNetMonth = document.getElementById("submitAssetNetMonth");
submitAssetNetMonth.addEventListener("click", monthlyNetAssets);

// 年淨資產
async function yearlyNetAssets() {
    const selectAssetsNetYear = document.getElementById("selectAssetsNetYear").value;
    let response = await fetch(`/financialanalysis/api/yearly/net?year=${selectAssetsNetYear}`,{
        method: "GET",
    });
    let records = await response.json();
    detailList.innerHTML = "";
    let payCash = 0;
    let payBank = 0;
    let receiveCash = 0;
    let receiveBank = 0;
    for (let i = 0; i < records.data.costAmountList.length; i++) {
        if (records.data.costAmountList[i].pay === "現金") {
            payCash += records.data.costAmountList[i].amount;
        }
        if (records.data.costAmountList[i].pay === "銀行存款") {
            payBank += records.data.costAmountList[i].amount;
        }
    }
    for (let i = 0; i < records.data.incomeAmountList.length; i++) {
        if (records.data.incomeAmountList[i].receive === "現金") {
            receiveCash += records.data.incomeAmountList[i].amount;
        }
        if (records.data.incomeAmountList[i].receive === "銀行存款") {
            receiveBank += records.data.incomeAmountList[i].amount;
        }
    }

    const netCash = receiveCash - payCash;
    const netBank = receiveBank - payBank;
    const netAssetsAmount = netCash + netBank;
    allNetAssets.textContent = selectAssetsNetYear + "淨資產 $" + netAssetsAmount.toLocaleString();

    const costAndIncome = ["現金", "銀行存款"];
    const costAndIncomeAmount = [netCash, netBank];

    getDoughnut(costAndIncome, costAndIncomeAmount, doughnutNetAssetsColor);
}

const submitAssetsNetYear = document.getElementById("submitAssetsNetYear");
submitAssetsNetYear.addEventListener("click", yearlyNetAssets);

// 點擊資產/負債
assets.addEventListener("click", function(){
    if (this.style.backgroundColor === "") {
        this.style.backgroundColor = "yellow";
        profiAndLoss.style.backgroundColor = "";
        assetsYear.style.backgroundColor = "";
        netAssets.style.backgroundColor = "yellow";
        assetsMonth.style.backgroundColor = "yellow";
        costAndIncome.style.display = "none";
        assetsAndLiability.style.display = "block";
        yearAssetsNet.style.display = "none";
        monthAssetsNet.style.display = "block";
        allNetAssets.style.display = "block";
        monthlyNetAssets();
    } else {
        this.style.backgroundColor = "yellow";
    }
})

// 點擊損益
profiAndLoss.addEventListener("click", function(){
    if (this.style.backgroundColor === "") {
        this.style.backgroundColor = "yellow";
        assets.style.backgroundColor = "";
        income.style.backgroundColor = "";
        balance.style.backgroundColor = "";
        years.style.backgroundColor = "";
        cost.style.backgroundColor = "yellow";
        months.style.backgroundColor = "yellow";
        assetsAndLiability.style.display = "none";
        costAndIncome.style.display = "block";
        chooseCostMonthList();
    } else {
        this.style.backgroundColor = "yellow";
    }
})

// 點擊資產月
assetsMonth.addEventListener("click", function(){
    if (this.style.backgroundColor === "") {
        this.style.backgroundColor = "yellow";
        assetsYear.style.backgroundColor = "";
        profiAndLoss.style.backgroundColor = "";
        assets.style.backgroundColor = "yellow";
        netAssets.style.backgroundColor = "yellow";
        yearAssetsNet.style.display = "none";
        monthAssetsNet.style.display = "block";
        monthlyNetAssets();
    } else {
        this.style.backgroundColor = "yellow";
    }
})

// 點擊資產年
assetsYear.addEventListener("click", function(){
    if (this.style.backgroundColor === "") {
        this.style.backgroundColor = "yellow";
        assetsMonth.style.backgroundColor = "";
        profiAndLoss.style.backgroundColor = "";
        assets.style.backgroundColor = "yellow";
        netAssets.style.backgroundColor = "yellow";
        monthAssetsNet.style.display = "none";
        yearAssetsNet.style.display = "block";
        yearlyNetAssets();
    } else {
        this.style.backgroundColor = "yellow";
    }
})

// 點擊支出
cost.addEventListener("click", function () {
  if (this.style.backgroundColor === "") {
    this.style.backgroundColor = "yellow";
    income.style.backgroundColor = "";
    balance.style.backgroundColor = "";
    if (months.style.backgroundColor === "yellow") {
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        monthCost.style.display = "block";
        totalIncome.style.display = "none";
        net.style.display = "none";
        totalCost.style.display = "block";
        chooseCostMonthList();
    }
    if (years.style.backgroundColor === "yellow") {
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        yearCost.style.display = "block";
        totalIncome.style.display = "none";
        net.style.display = "none";
        totalCost.style.display = "block";
        costYearList();
    }
  } else {
    this.style.backgroundColor = "yellow";
  }
});

// 點擊收入
income.addEventListener("click", function () {
  if (this.style.backgroundColor === "") {
    this.style.backgroundColor = "yellow";
    cost.style.backgroundColor = "";
    balance.style.backgroundColor = "";
    if (months.style.backgroundColor === "yellow") {
        monthCost.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        monthIncome.style.display = "block";
        totalCost.style.display = "none";
        net.style.display = "none";
        totalIncome.style.display = "block";
        chooseIncomeMonthList();
    }
    if (years.style.backgroundColor === "yellow") {
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        yearIncome.style.display = "block";
        totalCost.style.display = "none";
        net.style.display = "none";
        totalIncome.style.display = "block";
        incomeYearList();
    }
  } else {
    this.style.backgroundColor = "yellow";
  }
});

// 點擊結餘
balance.addEventListener("click", function () {
  if (this.style.backgroundColor === "") {
    this.style.backgroundColor = "yellow";
    income.style.backgroundColor = "";
    cost.style.backgroundColor = "";
    if (months.style.backgroundColor === "yellow") {
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        yearNet.style.display = "none";
        monthNet.style.display = "block";
        totalCost.style.display = "none";
        totalIncome.style.display = "none";
        net.style.display = "block";
        monthlyNetIncome();
    }
    if (years.style.backgroundColor === "yellow") {
        yearIncome.style.display = "none";
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "block";
        totalCost.style.display = "none";
        totalIncome.style.display = "none";
        net.style.display = "block";
        yearlyNetIncome();
    }
  } else {
    this.style.backgroundColor = "yellow";
  }
});

// 點擊月
months.addEventListener("click", function () {
  if (this.style.backgroundColor === "") {
    this.style.backgroundColor = "yellow";
    years.style.backgroundColor = "";
    if (cost.style.backgroundColor === "yellow") {
        income.style.backgroundColor = "";
        balance.style.backgroundColor = "";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        monthCost.style.display = "block";
        totalIncome.style.display = "none";
        net.style.display = "none";
        totalCost.style.display = "block";
        chooseCostMonthList();
    }
    if (income.style.backgroundColor === "yellow") {
        cost.style.backgroundColor = "";
        balance.style.backgroundColor = "";
        monthCost.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        monthIncome.style.display = "block";
        totalCost.style.display = "none";
        net.style.display = "none";
        totalIncome.style.display = "block";
        chooseIncomeMonthList();
    }
    if (balance.style.backgroundColor === "yellow") {
        cost.style.backgroundColor = "";
        income.style.backgroundColor = "";
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        yearNet.style.display = "none";
        monthNet.style.display = "block";
        totalCost.style.display = "none";
        totalIncome.style.display = "none";
        net.style.display = "block";
        monthlyNetIncome();
    }
  } else {
    this.style.backgroundColor = "yellow";
  }
});

// 點擊年
years.addEventListener("click", function () {
  if (this.style.backgroundColor === "") {
    this.style.backgroundColor = "yellow";
    months.style.backgroundColor = "";
    if (cost.style.backgroundColor === "yellow") {
        income.style.backgroundColor = "";
        balance.style.backgroundColor = "";
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        yearCost.style.display = "block";
        totalIncome.style.display = "none";
        net.style.display = "none";
        totalCost.style.display = "block";
        costYearList();
    }
    if (income.style.backgroundColor === "yellow") {
        cost.style.backgroundColor = "";
        balance.style.backgroundColor = "";
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "none";
        yearIncome.style.display = "block";
        totalCost.style.display = "none";
        net.style.display = "none";
        totalIncome.style.display = "block";
        incomeYearList();
    }
    if (balance.style.backgroundColor === "yellow") {
        cost.style.backgroundColor = "";
        income.style.backgroundColor = "";
        monthCost.style.display = "none";
        monthIncome.style.display = "none";
        yearCost.style.display = "none";
        yearIncome.style.display = "none";
        monthNet.style.display = "none";
        yearNet.style.display = "block";
        totalCost.style.display = "none";
        totalIncome.style.display = "none";
        net.style.display = "block";
        yearlyNetIncome();
    }
  } else {
    this.style.backgroundColor = "yellow";
  }
});