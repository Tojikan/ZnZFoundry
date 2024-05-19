import { BasicRollCommand } from "./basicRoll.js";
import { UseAndConsumeCommand } from "./useAndConsume.js";
import { ReloadCommand } from "./reload.js";



export class CommandFactory {
    commandList = {
        "basic": BasicRollCommand,
        "consume": UseAndConsumeCommand,
        "use": UseAndConsumeCommand,
        "reload": ReloadCommand
    };

    constructor(command, actor, item){
        this.command = command;
        this.actor = actor;
        this.item = item;
    }

    parseCommand(){
        let parsed = this.command.split("|");
        let comm = parsed[0].split(",");
        let argsRaw = parsed[1] ? parsed[1].split(",") : [];

        let args = {};

        for (let a of argsRaw){
            let arg = a.split(":");
            args[arg[0]] = arg[1] ?? true;
        }

        let result = {
            commands: comm,
            args: args
        };
        
        return result;
    }


    run(){
        let parsed = this.parseCommand();
        let prevResult = true;

        for (let c of parsed.commands){
            let CommandAct = this.commandList[c];

            if (!CommandAct){
                console.log("No Command Found for: " + c);
                continue;
            }

            if (!prevResult){
                console.log("Previous Command Failed. Skipping: " + c);
                return;
            }

            let command = new CommandAct(c, parsed.args, this.actor, this.item);
            prevResult = command.execute();
        }
    }
}