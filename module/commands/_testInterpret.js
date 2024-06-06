function parseCommand(command){
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


console.log(parseCommand("basic:type=attack|reload|consume:item=max"));
console.log(parseCommand("basic|attack|reload|fly:item,cost=2,uses=3"));
console.log(parseCommand("basic:item,attack"));
console.log(parseCommand("basic:skill=str|"));

