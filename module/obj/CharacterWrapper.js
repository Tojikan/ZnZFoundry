/**
 * Functionality involving Characters
 */
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
     */
    async roll(args){
        const actionName = args.name ?? "Roll";
        const attr = args.attribute;
        const skill = this.findSkill(args.skill);
        const item = args.item;
        const itemMultiplierStat = args.itemMultiplierStat;
        const spend = args.spend;

        if (!(attr in this.actor.system.attributes)){
            ui.notifications.warn(game.i18n.localize("ZNZRPG.attrNotFoundText"));
            throw new Error(`Character does not have the attribute ${attr}!`);
        }

        let diceFaceBonus = 0;
        if (skill){
            diceFaceBonus = skill.value;
        }
        
        //Calculate Roll Formula
        let numOfDice = this.actor.system.attributes[attr].value;
        let baseDiceFace = this.actor.calculated.calculatedDiceFace;
        let diceFace = baseDiceFace + diceFaceBonus;
        diceFace = Math.max(diceFace, 1);
        let formula = `${numOfDice}d${diceFace}`;
        
        // Roll Text
        let attribute = this.actor.system.attributes[attr];
        let attrLabel = game.i18n.localize(attribute.label);
        let rollText = `Rolling ${attrLabel} (${numOfDice})`
        if (skill) {
            rollText += ` against ${skill.name} skill  (${baseDiceFace}+${diceFaceBonus})`
        }

        //Calculate Roll
        const rollData = this.actor.getRollData();
        let roll = new Roll(formula, rollData);
        let rollResult = await roll.roll({
            async:true
        });
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
        };


        //Item Roll - has multiplier
        if (item && itemMultiplierStat && (itemMultiplierStat in item.system)){
            let multiplier = item.system[itemMultiplierStat].value;
            multiplier = Math.max(multiplier, 0);

            templateContext.hasItemMulti = true;
            templateContext.itemName = item.name;
            templateContext.multiplier = multiplier;
            templateContext.itemMultiplierStat = itemMultiplierStat;
            templateContext.totalMultiplied = multiplier * rollResult._total;
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
        }
        console.error("Unknown skill: " + skill);
        return null;
    
    }

    spendResources(){
        let health = this.actor.system.health.value;

        if (health <= 0){
            ui.notifications.error(game.i18n.localize("ZNZRPG.yourCharacterIsDead"));
            return -1;
        }

        let staCost = this.actor.calculated.satietyCost;
        let energyCost = this.actor.calculated.energyCost;
        let moraleCost = this.actor.calculated.moraleCost;
        
        let sta = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;
        let mor = this.actor.system.morale.value;
    
        
        //Spend health if we don't have enough of any resource
        let healthCost = 0;
        if (sta < staCost){
            healthCost += staCost - sta;
        }
        if (energy < energyCost){
            healthCost += energyCost - energy;
        }
        if (mor < moraleCost){
            healthCost += moraleCost - mor;
        }

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
}