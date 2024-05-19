import { CharacterWrapper } from '../obj/CharacterWrapper.js';
import { ItemWrapper } from '../obj/ItemWrapper.js';

//Base class for all commands
export class CommandAction {
    name = "CommandAction";

    constructor(name, args, actor, item){
        this.name = name;
        this.args = args;
        this.actor = actor;
        this.item = item;
        this.hasItem = !item ? false : true;

        this.characterWrapper = new CharacterWrapper(actor);
        this.itemWrapper = this.hasItem ? new ItemWrapper(item) : null;
    }

    //Meant to be overwritten
    execute(){
        console.log(`Command Action: no execute method defined for ${this.name}`);
    }
}