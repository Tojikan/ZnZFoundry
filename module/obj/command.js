import { CharacterWrapper } from './CharacterWrapper.js';
import { ItemWrapper } from './ItemWrapper.js';

export class CommandAction {

    constructor(command, actor, item){
        this.command = command;
        this.actor = actor;
        this.item = item;
        this.hasItem = !item ? false : true;

        this.characterWrapper = new CharacterWrapper(actor);
        this.itemWrapper = new ItemWrapper(item);
    }

    execute() {
        let parsed = this.parseCommand(this.command);
        this.mapCommand(parsed);
    }

    parseCommand(command){

        const result = {
            command: "",
            commandMod: null
        };

        let parsed = command.split("|");
        let comm = parsed[0].split(":");

        result.command = comm[0];
        result.commandMod = comm[1] ?? null;

        let modifiers = parsed[1] ?? null;

        if (modifiers) {
            let modType = modifiers.split("-")[0] ?? null;
            result.multiplier = modifiers.split("-")[1] ?? null;

            /**
             * Item modifier:
             * item-[stat]-[usageType]
             * stat: the name of the stat on the item that will multiply result of roll
             * usageType: what type of resource consumption to use on the item. See ItemWrapper for types.
             */
            if (modType == "item"){
                result.multiplier = modifiers.split("-")[1] ?? null;
                result.usageType = modifiers.split("-")[2] ?? "attack";
                result.usesItem = true;
            }
        }

        return result;
    }


    mapCommand(parsed){
        let comm = parsed.command;

        const baseSkills = this.actor.system.baseSkills;
        const attributes = this.actor.system.attributes;

        if (comm in baseSkills || comm in attributes){
            this.basicRoll(parsed);
            return;
        }

        console.error("Unknown command: " + comm);
    }


    basicRoll(parsed){
        const baseSkills = this.actor.system.baseSkills;
        const attributes = this.actor.system.attributes;

        let comm = parsed.command;
        let name, attr, skill, multiplierStat = null;


        if (comm in baseSkills){
            attr = baseSkills[comm].defaultAttr;
            name = game.i18n.localize(baseSkills[comm].label);
            skill = comm;
        } else if (comm in attributes){
            attr = comm;
            name = game.i18n.localize(attributes[comm].label);
        } else {
            console.error("Unknown basic roll: " + comm);
            return false;
        }

        if (parsed.usesItem){
            if (parsed.multiplier && parsed.multiplier in this.item.system){
                multiplierStat = parsed.multiplier;
            }

            if (parsed.usageType == 'attack'){
                name = name + " Attack";
            }
            
            let itemTest = this.itemWrapper.testSpendResources(parsed.usageType);

            if (itemTest.success == false){
                return false;
            }
        }

        let args = {
            name: name + " Roll",
            attribute: attr,
            skill: skill,
            item: this.item,
            itemMultiplierStat: multiplierStat
        };

        let result = this.characterWrapper.attemptRoll(args);

        if (result){
            this.itemWrapper.spendResources(parsed.usageType);
        }

    }
}