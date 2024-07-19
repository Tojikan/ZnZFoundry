import { BasicRollCommand } from "./basicRoll.js";
import { UseCommand } from "./use.js";
import { ReloadCommand } from "./reload.js";
import { ResourceCommand } from "./resource.js";
import { findItem } from "../helpers/common.js";
import { SpendCommand } from "./spend.js";
import { RestCommand } from "./rest.js";



export class CommandInterpreter {
    commandList = [
        BasicRollCommand,
        UseCommand,
        ReloadCommand,
        ResourceCommand,
        SpendCommand,
        RestCommand
    ];

    constructor(command, actor, item){
        this.command = command;
        this.actor = actor;
        this.item = item;
    }


    //Each command is separated by a pipe |
    //Each command can have arguments separated by a colon :
    //Each argument can have a value with =
    //Multiple args are separated by a comma ,
    //Example: basic:type=attack|reload|consume:item=max,arg2=test
    //[commands]|[args]
    parseCommand(command){
        let blocks = command.split("|");

        let result = [];

        for ( let b of blocks){
            let parsed = b.split(":");
            let command = parsed[0];
            let argsParse = parsed[1] ? parsed[1].split(",") : [];
            let args = {};

            for (let a of argsParse){
                let arg = a.split("=");
                args[arg[0]] = arg[1] ?? true;
            }

            result.push({
                command: command,
                args: args
            })
        }

        return result;
    }


    run(){
        let parsed = this.parseCommand(this.command);
        let prevResult = true;

        for (let p of parsed){

            if (!p.command || p.command.trim() == ""){
                continue;
            }

            if (!prevResult){
                console.error("Previous Command Failed. Skipping: " + c);
                return;
            }

            let found = false;

            for (let Comm of this.commandList){
                if (Comm.getName() == p.command){
                    let commandAct = new Comm(p.command, p.args, this.actor, this.item);
                    prevResult = commandAct.execute();
                    found = true;
                }
            }

            if (!found){
                console.log("Command not found: " + p.command);
            }
        }
    }
}

//External run command, used for macros and chat
export function runCommand(command, actorId, itemId){
    let actor = game.actors.get(actorId);
    let item = findItem(itemId);

    let interpreter = new CommandInterpreter(command, actor, item);
    interpreter.run();
}