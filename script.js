let allData = [];
const saveBtn = document.getElementById("saveBtn");
const clear = document.getElementById("clear");
const totalEnteries = document.getElementById("enteries");
const historyDiv = document.getElementById("history");

function loadData(){
if (localStorage.getItem("data") !== null)
    allData =JSON.parse(localStorage.getItem("data"))

}
loadData();
saveBtn.addEventListener("click", function () {
    const studyInput = document.getElementById("study");
    const learningInput = document.getElementById("learning");
    const sleepInput = document.getElementById("Sleep");
    const ProteinInput = document.getElementById("Protein");
    const WorkoutInput = document.getElementById("Workout");
    const contentInput = document.getElementById("Content");
    const TradingInput = document.getElementById("Trade");
    const bussinessInput = document.getElementById("Bussiness");

    const studyhours = studyInput.value;
    const Learningmin = learningInput.value;
    const sleephours = sleepInput.value;
    const proteinintake = ProteinInput.value;
    const exercise = WorkoutInput.checked;
    const creation = contentInput.checked;
    const trading = TradingInput.checked;
    const build = bussinessInput.checked;

const dailyData ={
    date: new Date().toLocaleDateString(),
    studyHours : studyhours,
    learningMin : Learningmin,
    sleepHours : sleephours,
    proteinIntake : proteinintake,
    workout : exercise,
    content : creation,
    trade : trading,
    bussiness : build 
}
allData.push(dailyData);
saveData();
displayHistory();
displayStats();
dispalyGoals();
});

function saveData(){
const text = JSON.stringify(allData);
localStorage.setItem("data",text);
}

function displayHistory(){
historyDiv.textContent = ""
allData.forEach(element => {
    historyDiv.innerHTML +=  "<br><br><b>Date: </b> " + element.date + "<br><br>";
    historyDiv.innerHTML += "Hours Slept: " + element.sleepHours + "<br>"
    historyDiv.innerHTML += "Hours Studied: " + element.studyHours+ "<br>"
    historyDiv.innerHTML += "Workout: " + (element.workout ? "Done":"Missed") + "<br>"
    historyDiv.innerHTML += "Protien consumed: " + element.proteinIntake + "<br>"
    

});
totalEnteries.textContent = "Total Enteries:" + allData.length;
}
clear.addEventListener("click", function(){
    localStorage.removeItem("data");
    allData = [];
    historyDiv.innerHTML = "";
    totalEnteries.textContent = "Total Entries: 0";
    displayStats();
    dispalyGoals();
} );
function displayStats(){
    let totalStudy =0;
    let avgSleep = 0;
    let totalSleep = 0;
    let workoutDays = 0;
    let workoutPercentage= 0;
     let proteinConsumed = 0;
    allData.forEach(element =>{
        totalStudy += Number(element.studyHours);
        totalSleep += Number(element.sleepHours);
        proteinConsumed += Number(element.proteinIntake);
        if (element.workout === true)
           workoutDays++;
    })
    avgSleep = totalSleep/allData.length;
    workoutPercentage = workoutDays/allData.length;

    const totalStudyElement =
    document.getElementById("totalStudyHours");
    totalStudyElement.innerHTML=
    "📚<br>Study Hours<br><br>" + totalStudy;
    
    const avgSleepElement =
    document.getElementById("averageSleep");
    avgSleepElement.textContent=
    "Average Sleep Hours: " + avgSleep;

    const workoutElement =
    document.getElementById("workoutDays");
    workoutElement.textContent=
    "Workout Percentage: " + workoutPercentage*100 + "%";

    const proteinElement =
    document.getElementById("totalProtein");
    proteinElement.textContent=
    "Total Protein Consumed: " + proteinConsumed + "grams";
}
function dispalyGoals(){
    const studyGoal = 30;
    let studyThisWeek = 0;
    const workoutGoal = 6;
    let workoutThisWeek = 0;
    const sleepTarget = 6;
    let sleepThisWeek = 0;
    const thisWeekData = allData.slice(-7);
    thisWeekData.forEach(element =>{
        studyThisWeek += Number(element.studyHours);
        if (element.workout === true)
           workoutThisWeek++;
        if (Number(element.sleepHours) >= 7 )
            sleepThisWeek++;
    }
    )
    const studyGoalElement = document.getElementById("studyGoal");
    studyGoalElement.innerHTML =
    "🎯<br>Study Goal<br><br>" +
    studyThisWeek + " / " + studyGoal + "h";

    let studyProgress =
    (studyThisWeek / studyGoal) * 100;

    if (studyProgress > 100) {
    studyProgress = 100;
    }
    const studyProgressElement = document.getElementById("studyProgress");
    studyProgressElement.style.width =
    + studyProgress + "%";
    studyProgressElement.textContent =
    Math.round(studyProgress) + "%";

    const workoutGoalElement = document.getElementById("workoutGoal");
    workoutGoalElement.innerHTML =
    "🎯<br>Workout Frequency<br><br>" +
    workoutThisWeek + " / " + workoutGoal + "days";

    let workoutProgress =
    (workoutThisWeek / workoutGoal) * 100;

    if (workoutProgress > 100) {
    workoutProgress = 100;
    }
    const workoutProgressElement = document.getElementById("workoutProgress");
    workoutProgressElement.style.width =
    + workoutProgress + "%";
    workoutProgressElement.textContent =
    Math.round(workoutProgress) + "%";

     const sleepTargetElement = document.getElementById("sleepTarget");
    sleepTargetElement.innerHTML =
    "🎯<br> Sleep Target Hit<br><br>" +
    sleepThisWeek + " / " + sleepTarget + "days";

    let sleepProgress =
    (sleepThisWeek / sleepTarget) * 100;

    if (sleepProgress > 100) {
    sleepProgress = 100;
    }
    const sleepProgressElement = document.getElementById("sleepProgress");
    sleepProgressElement.style.width =
    + sleepProgress + "%";
    sleepProgressElement.textContent =
    Math.round(sleepProgress) + "%";
    
  


    

}
displayHistory();
displayStats();
dispalyGoals();


