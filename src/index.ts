import {fromEvent}  from "rxjs";
import {getValue} from './interpreter';
import {filter} from 'rxjs/operators';
import {run} from './interpreter';

const acorn = require("acorn");

let input = document.querySelector('#input');
let arr: string[] = [];
let rescount = 0;

const KeyUp = fromEvent(input, 'keyup');
const KeyDown = fromEvent(input, 'keydown');
const keyEnter = KeyUp.pipe(
    filter((e: KeyboardEvent) => e.keyCode === 13)
);

KeyUp.pipe(
    filter((e: KeyboardEvent) => e.keyCode === 38)
    )
    .subscribe(function() {
    if (rescount >= 0 && rescount < arr.length) {
        let val = arr[rescount];
        rescount = rescount +1;
        document.querySelector('input').value = val;
    }
})

KeyDown.pipe(
    filter((e: KeyboardEvent) => e.keyCode === 40)
    )
    .subscribe(function() {
        if (rescount <= arr.length && rescount > 0) {
            rescount = rescount - 1; 
            let val1 = arr[rescount];
            document.querySelector('input').value = val1;
        }
    })

keyEnter.subscribe(function () {
    let value = (<HTMLInputElement>event.target).value.trim();
    let eVal = "";
    if (value) {
        if (value == "clear") {
            arr.unshift(value);
            document.querySelector('input').value = "";
            return document.getElementById("output").innerHTML = "";
        }
        else if (!/(var|let|const)/.test(value)) {
            eVal = `print(${value})`;
        }
    }
    try {
        const body = acorn.parse(eVal || value, { ecmaVersion: 2020 }).body;
        const jsInterpreter = run(body);
        let result = getValue();
        const finalResult = result ? value + " = " + result : value;
        let textNode =  document.createTextNode(finalResult);
        let node = document.createElement("li");
        node.appendChild(textNode);
        document.getElementById("output").appendChild(node);
        arr.unshift(value);
        rescount=0;
    }
    catch {
        console.log("error");
    }
    document.querySelector('input').value = "";
})