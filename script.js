let allData = [];

const saveBtn = document.getElementById("saveBtn");
const clear = document.getElementById("clear");

const totalEnteries = document.getElementById("enteries");
const historyDiv = document.getElementById("history");


// -------------------------
// LOAD DATA
// -------------------------

function loadData() {

    const savedData = localStorage.getItem("data");

    if (savedData !== null) {
        allData = JSON.parse(savedData);
    }

}

loadData();


// -------------------------
// SAVE PROGRESS
// -------------------------

saveBtn.addEventListener("click", function () {

    const codeTimeInput = document.getElementById("codeTime");
    const questionsInput = document.getElementById("questions");

    const sleepInput = document.getElementById("Sleep");
    const proteinInput = document.getElementById("Protein");

    const workoutInput = document.getElementById("Workout");

    const contentInput = document.getElementById("Content");
    const tradingInput = document.getElementById("Trade");
    const businessInput = document.getElementById("Bussiness");


    const dailyData = {

        date: getTodayDate(),

        codeTime: Number(codeTimeInput.value) || 0,
        questions: Number(questionsInput.value) || 0,

        sleepHours: Number(sleepInput.value) || 0,
        proteinIntake: Number(proteinInput.value) || 0,

        workout: workoutInput.checked,

        content: contentInput.checked,
        trade: tradingInput.checked,
        business: businessInput.checked

    };


    const existingIndex = allData.findIndex(function (element) {
    return element.date === dailyData.date;
    });

    if (existingIndex !== -1) {
        allData[existingIndex] = dailyData;
    } else {
        allData.unshift(dailyData);
    }

    saveData();

    displayHistory();
    displayStats();
    displayGoals();


    // Clear inputs after saving

    codeTimeInput.value = "";
    questionsInput.value = "";

    sleepInput.value = "";
    proteinInput.value = "";

    workoutInput.checked = false;

    contentInput.checked = false;
    tradingInput.checked = false;
    businessInput.checked = false;

});


// -------------------------
// SAVE TO LOCAL STORAGE
// -------------------------

function saveData() {

    const text = JSON.stringify(allData);

    localStorage.setItem("data", text);

}


// -------------------------
// GET TODAY'S DATE
// -------------------------

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;

}


// -------------------------
// GET CURRENT WEEK
// MONDAY -> SUNDAY
// -------------------------

function getCurrentWeekDates() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const day = today.getDay();

    const difference = day === 0 ? 6 : day - 1;

    const monday = new Date(today);

    monday.setDate(today.getDate() - difference);

    const dates = [];

    for (let i = 0; i < 7; i++) {

        const date = new Date(monday);

        date.setDate(monday.getDate() + i);

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const dayNumber = String(date.getDate()).padStart(2, "0");

        dates.push(
            year + "-" + month + "-" + dayNumber
        );
    }

    return dates;
}


// -------------------------
// GET THIS WEEK DATA
// -------------------------

function getThisWeekData() {

    const weekDates = getCurrentWeekDates();

    return allData.filter(function (element) {

        return weekDates.includes(element.date);

    });

}


// -------------------------
// GET LAST WEEK DATA
// -------------------------

function getLastWeekData() {

    const currentWeek = getCurrentWeekDates();

    const monday = new Date(currentWeek[0]);

    monday.setDate(monday.getDate() - 7);


    const dates = [];

    for (let i = 0; i < 7; i++) {

        const date = new Date(monday);

        date.setDate(monday.getDate() + i);

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        dates.push(
            year + "-" + month + "-" + day
        );

    }


    return allData.filter(function (element) {

        return dates.includes(element.date);

    });

}




// -------------------------
// HISTORY
// -------------------------

function displayHistory() {

    const historyToShow = allData;

    historyDiv.innerHTML = "";


    historyToShow.forEach(function (element) {

        historyDiv.innerHTML +=
            "<br><b>Date:</b> " + element.date + "<br><br>";

        historyDiv.innerHTML +=
            "Code Time: " + element.codeTime + " hours<br>";

        historyDiv.innerHTML +=
            "Questions Solved: " + element.questions + "<br>";

        historyDiv.innerHTML +=
            "Hours Slept: " + element.sleepHours + "<br>";

        historyDiv.innerHTML +=
            "Workout: " +
            (element.workout ? "Done" : "Missed") +
            "<br>";

        historyDiv.innerHTML +=
            "Protein consumed: " +
            element.proteinIntake +
            " grams<br>";

        historyDiv.innerHTML +=
            "Content Creation: " +
            (element.content ? "Done" : "Missed") +
            "<br>";

        historyDiv.innerHTML +=
            "Trading: " +
            (element.trade ? "Done" : "Missed") +
            "<br>";

        historyDiv.innerHTML +=
            "Business: " +
            (element.business ? "Done" : "Missed") +
            "<br>";

        historyDiv.innerHTML +=
            "<br>--------------------<br>";

    });


    totalEnteries.textContent =
        "Total Entries: " + allData.length;

}


// -------------------------
// CLEAR HISTORY
// -------------------------

clear.addEventListener("click", function () {

    localStorage.removeItem("data");

    allData = [];

    historyDiv.innerHTML = "";

    totalEnteries.textContent =
        "Total Entries: 0";

    displayStats();

    displayGoals();

});


// -------------------------
// CHECK IF DAY WAS ACTIVE
// -------------------------

function wasActive(element) {

    return (
        Number(element.codeTime) > 0 ||
        Number(element.questions) > 0 ||
        element.workout === true ||
        Number(element.proteinIntake) > 0
    );

}


// -------------------------
// CURRENT STREAK
// -------------------------

function getCurrentStreak() {
    const activeDates = new Set();

    allData.forEach(function (element) {
        if (wasActive(element)) {
            activeDates.add(element.date);
        }
    });

    let streak = 0;

    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    // If today has no activity, start checking from yesterday
    const todayKey = getDateKey(checkDate);

    if (!activeDates.has(todayKey)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (activeDates.has(getDateKey(checkDate))) {
        streak++;

        checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
}


// -------------------------
// BEST STREAK
// -------------------------

function getBestStreak() {
    const activeDates = new Set();

    allData.forEach(function (element) {
        if (wasActive(element)) {
            activeDates.add(element.date);
        }
    });

    const dates = Array.from(activeDates).sort();

    if (dates.length === 0) {
        return 0;
    }

    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
        const previous = dates[i - 1];
        const current = dates[i];

        const previousDate = new Date(
            Number(previous.substring(0, 4)),
            Number(previous.substring(5, 7)) - 1,
            Number(previous.substring(8, 10))
        );

        const currentDate = new Date(
            Number(current.substring(0, 4)),
            Number(current.substring(5, 7)) - 1,
            Number(current.substring(8, 10))
        );

        const difference =
            (currentDate - previousDate) / (1000 * 60 * 60 * 24);

        if (difference === 1) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
        }
    }

    return bestStreak;
}


// -------------------------
// DATE KEY
// -------------------------

function getDateKey(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");


    return year + "-" + month + "-" + day;

}


// -------------------------
// DISPLAY STATS
// -------------------------

function displayStats() {

    const thisWeekData = getThisWeekData();


    let totalStudy = 0;
    let totalQuestions = 0;
    let totalSleep = 0;
    let proteinConsumed = 0;


    thisWeekData.forEach(function (element) {

        totalStudy += Number(element.codeTime) || 0;

        totalQuestions += Number(element.questions) || 0;

        totalSleep += Number(element.sleepHours) || 0;

        proteinConsumed +=
            Number(element.proteinIntake) || 0;

    });


    // -------------------------
    // AVERAGE SLEEP
    // -------------------------

    const sleepByDate = {};

    thisWeekData.forEach(function (element) {

        if (!sleepByDate[element.date]) {

            sleepByDate[element.date] =
                Number(element.sleepHours) || 0;

        }

    });


    const sleepValues =
        Object.values(sleepByDate);


    let averageSleep = 0;

    if (sleepValues.length > 0) {

        averageSleep =
            sleepValues.reduce(
                (a, b) => a + b,
                0
            ) / sleepValues.length;

    }


    // -------------------------
    // WORKOUT DAYS
    // -------------------------

    const workoutDates = new Set();


    thisWeekData.forEach(function (element) {

        if (element.workout === true) {

            workoutDates.add(element.date);

        }

    });


    const workoutDays =
        workoutDates.size;


    const workoutPercentage =
        (workoutDays / 7) * 100;


    // -------------------------
    // DASHBOARD
    // -------------------------

    document.getElementById("totalStudyHours").innerHTML =
        "💻<br>" +
        "Code Time This Week<br><br>" +
        totalStudy.toFixed(1) +
        " hours";


    document.getElementById("averageSleep").innerHTML =
    "😴<br>Average Sleep<br><br>" + averageSleep.toFixed(1) + " hours";

    document.getElementById("totalQuestions").innerHTML =
    "🧠<br>Questions Solved<br><br>" + totalQuestions;


    document.getElementById("workoutDays").innerHTML =
        "🏋️<br>" +
        "Workout Percentage<br><br>" +
        workoutPercentage.toFixed(0) +
        "%";


    document.getElementById("totalProtein").innerHTML =
        "🥩<br>" +
        "Protein This Week<br><br>" +
        proteinConsumed +
        " grams";


    // -------------------------
    // STREAKS
    // -------------------------

    const currentStreak =
        getCurrentStreak();

    const bestStreak =
        getBestStreak();


    document.getElementById("currentStreak").innerHTML =
        "🔥<br>" +
        "Current Streak<br><br>" +
        currentStreak +
        " days";


    document.getElementById("bestStreak").innerHTML =
        "🏆<br>" +
        "Best Streak<br><br>" +
        bestStreak +
        " days";


    // -------------------------
    // BEST STUDY DAY
    // -------------------------

    const studyByDate = {};


    thisWeekData.forEach(function (element) {

        if (!studyByDate[element.date]) {

            studyByDate[element.date] = 0;

        }

        studyByDate[element.date] +=
            Number(element.codeTime) || 0;

    });


    let bestStudyDay = 0;
    let bestStudyDate = "No data";


    Object.keys(studyByDate).forEach(function (date) {

        if (studyByDate[date] > bestStudyDay) {

            bestStudyDay =
                studyByDate[date];

            bestStudyDate =
                date;

        }

    });


    document.getElementById("bestStudyDay").innerHTML =
        "🎓<br>" +
        "Best Study Day<br><br>" +
        bestStudyDate +
        " — " +
        bestStudyDay.toFixed(1) +
        " hours";


    // -------------------------
    // WEEKLY COMPARISON
    // -------------------------

    const lastWeekData =
        getLastWeekData();


    let thisWeekStudy = 0;
    let lastWeekStudy = 0;


    thisWeekData.forEach(function (element) {

        thisWeekStudy +=
            Number(element.codeTime) || 0;

    });


    lastWeekData.forEach(function (element) {

        lastWeekStudy +=
            Number(element.codeTime) || 0;

    });


    const difference =
        thisWeekStudy - lastWeekStudy;


    let percentageChange = null;

    if (lastWeekStudy > 0) {

        percentageChange = (difference / lastWeekStudy) * 100;
    }


    let changeSymbol = "→";


    if (difference > 0) {

        changeSymbol = "↑";

    } else if (difference < 0) {

        changeSymbol = "↓";

    }


    document.getElementById("weeklyComparison").innerHTML =
        "📊<br>" +
        "Weekly Comparison<br><br>" +
        "This Week: " +
        thisWeekStudy.toFixed(1) +
        " hours<br>" +

        "Last Week: " +
        lastWeekStudy.toFixed(1) +
        " hours<br>" +

        "Difference: " +
        changeSymbol +
        " " +
        difference.toFixed(1) +
        " hours<br>" +

        "Change: " +
        (percentageChange === null
            ? "New"
            : percentageChange.toFixed(1) + "%");

}


// -------------------------
// GOALS
// -------------------------

function displayGoals() {

    const thisWeekData =
        getThisWeekData();


    // -------------------------
    // STUDY GOAL
    // -------------------------

    const studyGoal = 30;

    let studyThisWeek = 0;


    thisWeekData.forEach(function (element) {

        studyThisWeek +=
            Number(element.codeTime) || 0;

    });


    let studyProgress =
        (studyThisWeek / studyGoal) * 100;


    if (studyProgress > 100) {

        studyProgress = 100;

    }


    document.getElementById("studyGoal").innerHTML =
        "🎯<br>" +
        "Study Goal<br><br>" +
        studyThisWeek.toFixed(1) +
        " / " +
        studyGoal +
        " hours";


    const studyProgressElement =
        document.getElementById("studyProgress");


    studyProgressElement.style.width =
        studyProgress + "%";


    studyProgressElement.textContent =
        Math.round(studyProgress) + "%";


    // -------------------------
    // WORKOUT GOAL
    // -------------------------

    const workoutGoal = 6;

    const workoutDates = new Set();


    thisWeekData.forEach(function (element) {

        if (element.workout === true) {

            workoutDates.add(element.date);

        }

    });


    const workoutThisWeek =
        workoutDates.size;


    let workoutProgress =
        (workoutThisWeek / workoutGoal) * 100;


    if (workoutProgress > 100) {

        workoutProgress = 100;

    }


    document.getElementById("workoutGoal").innerHTML =
        "🏋️<br>" +
        "Workout Frequency<br><br>" +
        workoutThisWeek +
        " / " +
        workoutGoal +
        " days";


    const workoutProgressElement =
        document.getElementById("workoutProgress");


    workoutProgressElement.style.width =
        workoutProgress + "%";


    workoutProgressElement.textContent =
        Math.round(workoutProgress) + "%";


    // -------------------------
    // SLEEP GOAL
    // -------------------------

    const sleepTarget = 7;

    const sleepDates = new Set();


    thisWeekData.forEach(function (element) {

        if (
            Number(element.sleepHours) >=
            sleepTarget
        ) {

            sleepDates.add(element.date);

        }

    });


    const sleepThisWeek =
        sleepDates.size;


    let sleepProgress =
        (sleepThisWeek / 7) * 100;


    if (sleepProgress > 100) {

        sleepProgress = 100;

    }


    document.getElementById("sleepTarget").innerHTML =
        "😴<br>" +
        "Sleep Target Hit<br><br>" +
        sleepThisWeek +
        " / 7 days";


    const sleepProgressElement =
        document.getElementById("sleepProgress");


    sleepProgressElement.style.width =
        sleepProgress + "%";


    sleepProgressElement.textContent =
        Math.round(sleepProgress) + "%";

}


// -------------------------
// INITIAL DISPLAY
// -------------------------

displayHistory();

displayStats();

displayGoals();