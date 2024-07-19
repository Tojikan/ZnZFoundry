/**
 * Functionality involving Characters
 */
import { sendRedMessage } from "../helpers/messageHelper.js";


export class CharacterWrapper {
    constructor(actor){
        this.actor = actor;
    }

    attemptRoll(args){
        if (!("attribute" in args) || !args.attribute || args.attribute == ""){
            ui.notifications.error(game.i18n.localize("ZNZRPG.attrNotFoundText"));
            throw new Error("No attribute was provided for a roll!"); 
        }

        this.snapshotResources();
        let spend = this.spendResources();

        if (spend == -1){
            this.unspendResources();
            return false;
        }
        
        args.spend = spend;
        
        try {
            return this.roll(args);
        } catch (error){
            console.error(error);
            this.unspendResources();
        }
    }


    /**
     * args:
     *  name: Name of the roll
     *  attribute: character attr stat
     *  skill: skill to use
     *  item: Using an item, if applicable
     *  itemMultiplierStat: item stat to multiply roll by, if there is an item
     *  multi: Multiplier for roll, overrides all.
     *  bonus: Add to diceface
     */
    async roll(args){
        const actionName = args.name ?? "Roll";
        const attr = args.attribute;
        const skill = this.findSkill(args.skill);
        const item = args.item;
        const itemMultiplierStat = args.itemMultiplierStat;
        const spend = args.spend;
        const multi = args.multi;
        const bonus = args.bonus;

        if (!(attr in this.actor.system.attributes)){
            ui.notifications.warn(game.i18n.localize("ZNZRPG.attrNotFoundText"));
            throw new Error(`Character does not have the attribute ${attr}!`);
        }

        let diceFaceBonus = bonus ?? 0;
        if (skill){
            diceFaceBonus = skill.value;
        }
        
        //Calculate Roll Formula
        let numOfDice = this.actor.system.attributes[attr].value;
        let baseDiceFace = this.actor.calculated.calculatedDiceFace;

        //Check adrenaline rush
        let isAdrenaline = false;
        let adrenalineBonus = 0;
        for (let effect of this.actor.effects){
            if (effect.name == "toggleAdrenaline" && !effect.disabled){
                adrenalineBonus = this.actor.system.config.adrenalineBonus.value;
                baseDiceFace = this.actor.system.config.baseDiceFace.value;
                isAdrenaline = true;
            }
        }


        let diceFace = baseDiceFace + diceFaceBonus + adrenalineBonus;
        diceFace = Math.max(diceFace, 1);
        let formula = `${numOfDice}d${diceFace}`;
        
        // Roll Text
        let attribute = this.actor.system.attributes[attr];
        let attrLabel = game.i18n.localize(attribute.label);
        let rollText = `Rolling ${attrLabel} (${numOfDice}) with dice (d${baseDiceFace})`;
        if (skill) {
            rollText += ` with ${skill.name} skill bonus  (${diceFaceBonus >= 0 ? '+' : '-'}${diceFaceBonus} )`
        }
        if (isAdrenaline){
            rollText += ` with Adrenaline bonus (+${this.actor.system.config.adrenalineBonus.value})`
        }




        //Calculate Roll
        const rollData = this.actor.getRollData();
        let roll = new Roll(formula, rollData);
        let rollResult = await roll.roll();
        let tooltip = await roll.getTooltip();
        
        //Data to pass to template
        let templateContext = {
            roll: rollResult,
            actor: this.actor.name,
            formula: roll._formula,
            total: rollResult._total,
            tooltip: tooltip,
            actionName: actionName,
            flavor: rollText,
            healthSpend: spend == 0,
            freeRoll: spend == 2,
            isAdrenaline: isAdrenaline
        };


        //Multiplier 
        if (multi && !isNaN(multi)){
            templateContext.hasMulti = true;
            templateContext.multiplier = multi;
            templateContext.totalMultiplied = multi * rollResult._total;
            templateContext.multiplierText = `Multiply result of roll by ${multi}`;
        }

        //Item Multiplier if no other multiplier
        if (!templateContext.hasMulti && item && itemMultiplierStat && (itemMultiplierStat in item.system)){
            let multiplier = item.system[itemMultiplierStat].value;
            multiplier = Math.max(multiplier, 0);

            templateContext.hasMulti = true;
            templateContext.multiplier = multiplier;
            templateContext.totalMultiplied = multiplier * rollResult._total;
            templateContext.multiplierText = `Multiply result of roll by <strong>${item.name}</strong>'s ${itemMultiplierStat} stat (${multiplier}):`;
        }

        let messageData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: await renderTemplate("systems/znz4e/templates/chat/itemRoll.hbs", templateContext)
        };

        ChatMessage.create(messageData);

        return true;
    }

    findSkill(skill){
        if (!skill || skill == ""){
            return null;
        }

        let baseSkills = this.actor.system.baseSkills;

        if (skill in baseSkills){
            return {
                name: game.i18n.localize(baseSkills[skill].label),
                value: baseSkills[skill].value
            }
        } else {
            let result = this.actor.items.get(skill)
            if (result && result.type == "skill" && result.system.rollable && result.system.rollable.hasRoll){
                return {
                    name: result.name,
                    value: result.system.rollable.bonus
                }
            }
        }


        console.error("Unknown skill: " + skill);
        return null;
    
    }

    spendResources(force = false){
        let health = this.actor.system.health.value;

        if (health <= 0){
            ui.notifications.error(game.i18n.localize("ZNZRPG.yourCharacterIsDead"));
            sendRedMessage(`${this.actor.name} is dead!`, this.actor);
            return -1;
        }

        for (let effect of this.actor.effects){
            //No spend on free rolls.
            if(!force && effect.name == "toggleFreeRolls" && !effect.disabled){
                return 2;
            }
        }

        let staCost = this.actor.calculated.satietyCost;
        let energyCost = this.actor.calculated.energyCost;
        let moraleCost = this.actor.calculated.moraleCost;
        let healthCost = this.actor.calculated.healthCost;
        
        let sta = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;
        let mor = this.actor.system.morale.value;

        //Calculate new resource values and update
        let newSatiety = Math.max(sta - staCost, 0);
        let newEnergy = Math.max(energy - energyCost, 0);
        let newMorale = Math.max(mor - moraleCost, 0);
        let newHealth = Math.max(health - healthCost, 0);

        this.actor.update({
            "system.satiety.value": newSatiety, 
            "system.energy.value": newEnergy,
            "system.morale.value": newMorale,
            "system.health.value": newHealth
        });

        //So we can know if we're spending health or not.
        if (healthCost > 0){
            return 0;
        }

        return 1;
    }

    snapshotResources(){
        let health = this.actor.system.health.value;
        let sta = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;
        let mor = this.actor.system.morale.value;

        this.snapshot = {
            health: health,
            satiety: sta,
            energy: energy,
            morale: mor
        };
    }

    unspendResources(){
        if (!this.snapshot){
            this.fallbackUnspendResources();
            return;
        }

        this.actor.update({
            "system.satiety.value": this.snapshot.satiety, 
            "system.energy.value": this.snapshot.energy,
            "system.morale.value": this.snapshot.morale,
            "system.health.value": this.snapshot.health
        });
    }

    fallbackUnspendResources(){
        let staCost = this.actor.calculated.satietyCost;
        let energyCost = this.actor.calculated.energyCost;
        let moraleCost = this.actor.calculated.moraleCost;

        let sta = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;
        let morale = this.actor.system.morale.value;

        let maxSatiety = this.actor.system.satiety.max;
        let maxEnergy = this.actor.system.energy.max;
        let maxMorale = this.actor.system.morale.max;

        let newSatiety = Math.min(sta + staCost, maxSatiety);
        let newEnergy = Math.min(energy + energyCost, maxEnergy);
        let newMorale = Math.min(morale + moraleCost, maxMorale);

        this.actor.update({
            "system.satiety.value": newSatiety, 
            "system.energy.value": newEnergy,
            "system.morale.value": newMorale
        });
    }



    getItems(type = '', equippedOnly = true){
        let result = [];

        for (let itm of this.actor.items){
            if (type.length){
                if (itm.type != type){
                    continue;
                }
            }

            if (equippedOnly && !itm.system.equipped){
                continue;
            }

            result.push(itm);
        }

        return result;
    }

    addResources(vals){
        let satiety = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;
        let morale = this.actor.system.morale.value;
        let health = this.actor.system.health.value;

        let newSatiety = Math.min(satiety + vals.satiety, this.actor.system.satiety.max);
        let newEnergy = Math.min(energy + vals.energy, this.actor.system.energy.max);
        let newMorale = Math.min(morale + vals.morale, this.actor.system.morale.max);
        let newHealth = Math.min(health + vals.health, this.actor.system.health.max);

        newSatiety = Math.max(newSatiety, 0);
        newEnergy = Math.max(newEnergy, 0);
        newMorale = Math.max(newMorale, 0);
        newHealth = Math.max(newHealth, 0);

        this.actor.update({
            "system.satiety.value": newSatiety,
            "system.energy.value": newEnergy,
            "system.morale.value": newMorale,
            "system.health.value": newHealth
        });
    }


    useAmmo(type, amount){
        let store = this.actor.system.ammoStore;

        if (!(type in store)){
            ui.notifications.warn("Character does not have ammo type ${type}");
            console.error(`Character does not have ammo type ${type}`);
            return 0;
        }


        let ammo = store[type].value;

        let ammoReceived = Math.min(ammo, amount);
        let newAmmo = Math.max(ammo - amount, 0);

        this.actor.update({
            [`system.ammoStore.${type}.value`]: newAmmo
        });

        return ammoReceived;
    }
}