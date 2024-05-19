import { CommandAction } from './_commandAction.js';

/***
 * Basic ZNZ Roll Command. {attribute}D{roll + skill}
 * 
 * Also can utilize an Item.
 */
export class BasicRollCommand extends CommandAction {
    execute(){
        const baseSkills = this.actor.system.baseSkills;
        const attributes = this.actor.system.attributes;
        let usesItem = false;
        let itemUsageType = null;

        let rollArgs = {
            name: "Roll",
            attribute: null,
            skill: null,
            item: null,
            itemMultiplierStat: null
        };


        //Determine attribute to roll
        if ('attr' in this.args){
            let attr = this.args.attr;

            if (attr in attributes){
                rollArgs.attribute = attr;
                rollArgs.name = game.i18n.localize(attributes[attr].label) + " Roll";
            } else {
                console.error(`Attribute '${attr}' not found in character attributes`);
                return false;
            }
        }

        //Determine skill to roll. Has name prio over attribute
        if ('skill' in this.args){
            if (this.args.skill in baseSkills){
                let rollSkill = baseSkills[this.args.skill];
                rollArgs.skill = this.args.skill;
                rollArgs.name = game.i18n.localize(rollSkill.label) + " Roll"; // skill has name prio over attribute
                rollArgs.attribute = !rollArgs.attribute ? rollSkill.defaultAttr : rollArgs.attribute; //If no attribute was set, use default attribute
            }
        }

        //Determine how Item affects the roll
        if ('item' in this.args && this.hasItem){
            usesItem = true;
            itemUsageType = this.args.item; //attack,defend,use,consume

            rollArgs.item = this.item;
            rollArgs.name = this.itemWrapper.getRollName(itemUsageType);

            let usages = this.itemWrapper.getUsedAttrAndSkill(itemUsageType);

            if (!rollArgs.attribute){
                rollArgs.attribute = usages.attr;
            }

            if (!rollArgs.skill){
                rollArgs.skill = usages.skill;
            }

            if (!rollArgs.itemMultiplierStat){
                rollArgs.itemMultiplierStat = usages.multi;
            }

            //Determine if this roll can even happen based on item's available resources
            let itemTest = this.itemWrapper.testSpendResources(itemUsageType);

            if (itemTest.success == false){
                return false;
            }
        }

        //Override Name
        if ('name' in this.args){
            rollArgs.name = this.args.name;
        }

        
        //The only required parameter for a roll is the attribute.
        if (!rollArgs.attribute){
            console.error("No attribute found for roll");
            return false;
        }

        let result = this.characterWrapper.attemptRoll(rollArgs);

        if (result && usesItem && itemUsageType){
            this.itemWrapper.spendResources(itemUsageType);
        }

        return true;
    }
}