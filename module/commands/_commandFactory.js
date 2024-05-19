import { BasicRollCommand } from "./basicRoll.js";



export class CommandFactory {
    commandList = {
        "basic": BasicRollCommand
    };

    constructor(command, actor, item){
        this.command = command;
        this.actor = actor;
        this.item = item;
    }

    parseCommand(){
        let parsed = this.command.split("|");
        let comm = parsed[0];
        let argsRaw = parsed[1].split(",");

        let args = {};

        for (let a of argsRaw){
            let arg = a.split(":");
            args[arg[0]] = arg[1] ?? true;
        }

        let result = {
            command: comm,
            args: args
        };
        
        return result;
    }


    run(){
        let parsed = this.parseCommand();
        let CommandAct = this.commandList[parsed.command];

        if (!CommandAct){
            console.log("No Command Found for: " + parsed.command);
            return false;
        }

        let command = new CommandAct(parsed.command, parsed.args, this.actor, this.item);
        command.execute();

        return true;
    }
}