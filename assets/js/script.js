//sets currentTime and currentDate
let time = moment();
$("#currentTime").text(moment().format('HH:mm a'));
$("#currentDay").text(moment().format("MMM Do YYYY"));
let current = time.hour();

var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
}

function setTasks(){
    //adds tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));   
}
function getTasks(){
    // loads tasks from localStorage + creates current tasks
    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if(loadedTasks){
        tasks = loadedTasks;
        //creates current tasks
        $.each(tasks, function(hour,task){
            var hourDiv = $("#"+hour);
            addTask(task, hourDiv);
        });
    }
    updateTask();
}
function addTask(taskEx, hourDiv){
    //creates specified task
    var indDiv = hourDiv.find(".task");
    var indP = $("<p>").addClass("description").text(taskEx);
    indDiv.html(indP);
}
function updateTask(){
    //updates css depending on TOD
    current = time.hour();
    $(".task-info").each( function(){
        var eleHr = parseInt($(this).attr("id"));
        if(eleHr < current){$(this).removeClass(["present","future"]).addClass("past");}
        else if(eleHr === current){$(this).removeClass(["past","future"]).addClass("present");}
        else{$(this).removeClass(["past","present"]).addClass("future");}
    });
}

function textAreaSave(textAreaEl){
    //replaces textarea element
    var info = textAreaEl.parent(".task-info");
    var areaText = info.find("textarea");
    var textTime = info.attr("id");
    var textTask = areaText.val().trim();

    tasks[textTime] = [textTask];
    setTasks();
    addTask(textTask, info);
}

//click handlers

$(".task").click(function(){
    //save tasks after clicked, not in localStorage
    $("textarea").each(function(){ 
        textAreaNoSave($(this));
    });

    //creates textarea element with current task
    var text = $(this).text();
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).html(textInput);
    textInput.trigger("focus");
});

$(".saveBtn").click(function(){
    textAreaSave($(this));
});

$(".clearBtn").click(function(){
    localStorage.clear();
    location.reload();
    return false;
});

//updates task backgrounds on a new hour
setTimeout(function(){
    setInterval(updateTask, 3600000);
}, 3600000 - time.milliseconds());

getTasks(); //gets tasks from localStorage on load

