const playGround = document.getElementsByClassName("demo")[0];
const speed = 1000;
const colors = ["#4e94d1", "#584dd1", "#ae4dd1", "#d14d5c", "#4dd175", "#cdd14d", "#d1844d"]
var prevColor = null;

function div(...arg) {
    let div = document.createElement("div");
    if (arg) {
        if ("id" in arg[0]) {
            div.id = arg[0]["id"];
        }

        if ("class" in arg[0]) {
            div.className = arg[0]["class"];
        }
    }
    return div;
}

playGround.appendChild(div({ "id": "stack" }));
const stack = document.getElementById("stack");

function registerValue(e = null) {
    if (e == null) {
        if (document.getElementById("register-value-temp")) {
            document.getElementById("register-value-temp").remove();
        }
        return;
    }
    if (document.getElementById("register-value-temp")) {
        document.getElementById("register-value-temp").remove();
    }
    let regval = div({ "id": "register-value-temp" });
    regval.innerHTML = e.title;
    regval.style.top = e.getBoundingClientRect().top + "px";
    playGround.appendChild(regval);
    regval.style.left = (e.getBoundingClientRect().left - 2 - regval.getBoundingClientRect().width) + "px";
}

function elemColor() {
    let num = Math.floor(Math.random() * colors.length);
    console.log(num);
    if (colors[num] == prevColor) {
        num++;
        num = num % colors.length;
    }
    prevColor = colors[num];
    return colors[num];
}

function sleep(time_ms) {
    return new Promise(resolve => setTimeout(resolve, time_ms));
}

function clearStack() {
    clearingStack = true;
    document.getElementById("stack").replaceChildren();
    setTimeout(()=>{
        clearingStack = false;
        executing = false;
        let svg = document.getElementById("play");
        svg.setAttribute("disabled", "false");
    }, 3000);
}

function playStackPush(elem) {
    let mem = div({ "class": "stack-elem" });
    mem.innerHTML = elem;
    mem.style.backgroundColor = elemColor();
    if(document.querySelector(".stack-elem:last-child")){
        mem.style.top = -stack.getBoundingClientRect().top+document.querySelector(".stack-elem:last-child").getBoundingClientRect().top-50 + "px";
    }
    mem.style.top = -stack.getBoundingClientRect().top-50 + "px";
    stack.appendChild(mem);
    setTimeout(() => {
        mem.style.top = "0px";
    }, 100);
}

function playStackPop(elem) {
    let mem = document.querySelector(".stack-elem:last-child");
    mem.style.top = stack.getBoundingClientRect().top-mem.getBoundingClientRect().top-50 + "px";
    setTimeout(async () => {
        mem.style.transform = "scale(0)";
        await sleep(300);
        mem.style.backgroundColor = "#FFF";
        mem.innerHTML = elem;
        mem.style.transform = "scale(1)";
        await sleep(1200);
        mem.remove();
    }, 1000);
}