import { Character } from './character.js';

export class CommandAction {

    constructor(command, actor, item){
        this.command = command;
        this.actor = actor;
        this.item = item;
        this.hasItem = !item ? false : true;

        this.character = new Character(actor);
    }

    execute() {
        this.mapCommand(this.command);
    }

    mapCommand(command){
        let parsed = command.split(":");

        let comm = parsed[0];
        let args = parsed[1] ?? null;

        if (args) {
            args = args.split(",");
        }

        switch(comm){
            case "skill":
                this.rollSkill(args);
                break;
            };
        }
        
    rollSkill(args){
        let spent = this.character.spendResources();

        if (!spent){
            return ui.notifications.error(game.i18n.localize("ZNZRPG.notEnoughResourcesText"));
        }


        const skill = args[0].trim();
        const baseSkills = this.actor.system.baseSkills;
        let diceBonus = 0;
        let rollAttr = null;

        if (skill in baseSkills){
            diceBonus = baseSkills[skill].value;
            rollAttr = baseSkills[skill].defaultRoll;
        }

        if (!rollAttr){
            ui.notifications.error(game.i18n.localize("ZNZRPG.skillNotFoundText"));
            this.character.unspendResources();
            throw new Error("SkillNotFound");
        }

        try {
            this.character.roll(rollAttr, diceBonus);
        } catch (error) {
            console.error(error);
            this.character.unspendResources();
        }

        console.log(this.actor);
    }
}