var state;
var registers = { "A": null, "B": null, "C": 20, "D": null, "E": null, "F": null, "G": "", "R": "", "Q": "", "a": "", "b": "" };
var CONFIG_VIEW = false;
var clearingStack = false;
var executing = false;
var errorTypes = {
    RegisterNotFound: 0,
    InvalidInstruction: 1,
    Warning: 2,
}

function stack_top() {
    return state.length > 0 ? state[state.length - 1] : null;
}

function update_registers_dock() {
    if (document.getElementsByClassName("dock-element").length != 0) {
        document.getElementById("register-dock").replaceChildren();
    }
    Object.keys(registers).forEach(element => {
        let reg = div({ "class": "dock-element" });
        reg.innerHTML = element;
        reg.setAttribute("title", registers[element]);
        reg.setAttribute("onmouseover", "registerValue(this)")
        reg.setAttribute("onmouseout", "registerValue()");
        document.getElementById("register-dock").appendChild(reg);
    });
}

function update_registers_config() {
    let lp = "";
    Object.keys(registers).map((e) => {
        let regVal = registers[e] != null ? registers[e] : "";
        lp += e + " " + regVal + "\n";
    });
    document.getElementById("registers").innerHTML = lp;
    update_registers_dock();
}

function update_registers_state(config) {
    config = config.split("\n");
    for (let mem in registers) delete registers[mem];
    config.forEach(element => {
        element = element.trim().split(" ");
        key = element[0];
        if (key == "") return;
        value = element.length >= 2 ? element[1] : null;
        registers[key] = value;
    });
}

function saved() {
    let lp = "";
    Object.keys(registers).map((e) => {
        let regVal = registers[e] != null ? registers[e] : "";
        lp += e + " " + regVal + "\n";
    });

    let code = document.getElementById("registers").innerHTML;
    code = code.replaceAll("<div>", "\n").replaceAll("</div>", "").replaceAll("<br>", "");

    return lp.trim() == code.trim();
}

function isalpha(ch) {
    return /^[A-Z]$/i.test(ch);
}

function error(errorType, ...arg) {
    let errorName = Object.keys(errorTypes);
    switch (errorType) {
        case 0:
            alert("line " + arg[0] + ": " + errorName[0] + " " + arg[1]);
            executing = false;
            break;
        case 1:
            alert("line " + arg[0] + ": " + errorName[1] + " " + arg[1]);
            executing = false;
            break;
        case 2:
            alert(errorName[2] + ": " + arg[0]);
        default:
            break;
    }
}

var executing;

document.getElementById("play").addEventListener("click", async (e) => {

    if (executing) {
        error(errorTypes.Warning, "Stack is being executed.")
        return;
    }

    if (CONFIG_VIEW) {
        if (!saved()) {
            let code = document.getElementById("registers").innerHTML;
            code = code.replaceAll("<div>", "\n").replaceAll("</div>", "").replaceAll("<br>", "");
            update_registers_state(code);
            update_registers_config();
        }
        return;
    }
    state = []
    let code = document.getElementsByClassName("code")[0].innerHTML;
    let mode = document.getElementById("numeric-mode").checked == true;
    code = code.replaceAll("<div>", "\n").replaceAll("</div>", "").replaceAll("<br>", "").split("\n");
    for (let i = 0; i < code.length; i++) {
        executing = true;
        let whole_ins = code[i].split(" ");
        let ins = whole_ins[0];
        let op = whole_ins[1];
        if (isalpha(op)) {
            let chk = op in registers;
            if (!chk) {
                error(errorTypes.RegisterNotFound, i + 1, op);
                return;
            }
        }
        ins = ins.toUpperCase();
        switch (ins) {
            case "PUSH":
                if ((stack_top() == null || stack_top() != op) && op != undefined && op != "") {
                    if (mode) {
                        op = isalpha(op) ? isalpha(registers[op]) ? 0 : parseInt(registers[op]) : parseInt(op);
                    }
                    else {
                        op = registers[op] != null ? registers[op] : op;
                    }
                    state.push(op);
                    playStackPush(op);
                    await sleep(1600);
                }
                break;
            case "POP":
                if (stack_top() != null) {
                    registers[op] = state.pop();
                    update_registers_config();
                    playStackPop(op);
                    await sleep(2700);
                }
                break;
            case "ADD":
                if (state.length >= 2) {
                    let a = state.pop();
                    playStackPop("");
                    await sleep(2700);
                    let b = state.pop();
                    playStackPop("+");
                    await sleep(2700);
                    if (mode) {
                        state.push(a + b);
                        playStackPush(a + b);
                        await sleep(1600);
                    }
                    else {
                        state.push(a + "+" + b);
                        playStackPush(a + "+" + b);
                        await sleep(1600);
                    }
                }
                break;
            case "SUB":
                if (state.length >= 2) {
                    let a = state.pop();
                    playStackPop("");
                    await sleep(2700);
                    let b = state.pop();
                    playStackPop("-");
                    await sleep(2700);
                    if (mode) {
                        state.push(a - b);
                        playStackPush(a - b);
                        await sleep(1600);
                    }
                    else {
                        state.push(a + "-" + b);
                        playStackPush(a + "-" + b);
                        await sleep(1600);
                    }
                }
                break;
            case "MUL":
                if (state.length >= 2) {
                    let a = state.pop();
                    playStackPop("");
                    await sleep(2700);
                    let b = state.pop();
                    playStackPop("*");
                    await sleep(2700);
                    if (mode) {
                        state.push(a * b);
                        playStackPush(a * b);
                        await sleep(1600);
                    }
                    else {
                        state.push(a + "*" + b);
                        playStackPush(a + "*" + b);
                        await sleep(1600);
                    }
                }
                break;
            case "DIV":
                if (state.length >= 2) {
                    let a = state.pop();
                    playStackPop("");
                    await sleep(2700);
                    let b = state.pop();
                    playStackPop("/");
                    await sleep(2700);
                    if (mode) {
                        state.push(a / b);
                        playStackPush(a / b);
                        await sleep(1600);
                    }
                    else {
                        state.push(a + "/" + b);
                        playStackPush(a + "/" + b);
                        await sleep(1600);
                    }
                }
                break;
            default:
                error(errorTypes.InvalidInstruction, i + 1, ins);
                return;
                break;
        }

    }
    executing = false;
})

document.getElementById("config").addEventListener("click", (e) => {
    if (!CONFIG_VIEW) {
        document.getElementById("code-file").style.display = "none";
        document.getElementById("registers").style.display = "block";
    }
    else {
        if (!saved()) {
            alert("Run the register file to save the changes");
            return;
        }
        document.getElementById("code-file").style.display = "block";
        document.getElementById("registers").style.display = "none";
    }
    CONFIG_VIEW = !CONFIG_VIEW;
})


update_registers_config();