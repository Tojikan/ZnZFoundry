export class Character {
    constructor(actor){
        this.actor = actor;
    }

    roll(attr, diceFaceBonus){
        if (!(attr in this.actor.system.attributes)){
            ui.notifications.warn(game.i18n.localize("ZNZRPG.attributeNotFoundText"));
            throw new Error("AttributeNotFound");
        } 

        let attribute = this.actor.system.attributes[attr];
        let attrLabel = game.i18n.localize(attribute.label);

        let numOfDice = this.actor.system.attributes[attr].value;
        let baseDiceFace = this.actor.calculated.calculatedDiceFace;
        let diceFace = baseDiceFace + diceFaceBonus;

        let formula = `${numOfDice}d${diceFace}`;
        const rollData = this.actor.getRollData();

        let roll = new Roll(formula, rollData);
        return roll.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `Rolling ${attrLabel}`
        })
    }

    spendResources(){
        let staCost = this.actor.calculated.satietyCost;
        let energyCost = this.actor.calculated.energyCost;
        let sta = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;

        if (sta < staCost || energy < energyCost) return false;

        let newSatiety = Math.max(sta - staCost, 0);
        let newEnergy = Math.max(energy - energyCost, 0);

        this.actor.update({
            "system.satiety.value": newSatiety, 
            "system.energy.value": newEnergy
        });

        return true;
    }

    unspendResources(){
        let staCost = this.actor.calculated.satietyCost;
        let energyCost = this.actor.calculated.energyCost;
        let sta = this.actor.system.satiety.value;
        let energy = this.actor.system.energy.value;
        let maxSatiety = this.actor.system.satiety.max;
        let maxEnergy = this.actor.system.energy.max;

        let newSatiety = Math.max(sta + staCost, maxSatiety);
        let newEnergy = Math.max(energy + energyCost, maxEnergy);

        this.actor.update({
            "system.satiety.value": newSatiety, 
            "system.energy.value": newEnergy
        });
    }
}