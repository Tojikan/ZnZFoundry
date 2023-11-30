import { NumberOrZero } from "./common.js";

export class CharacterHelper {
    static CalculatePenalty(context){
        let calculate = function(value, threshold, interval){
            if (value >= threshold) return 0;

            let val = Math.max(value, 0);

            let diff = threshold - val;

            return Math.ceil(diff / interval);
        };

        let result = {
            health: calculate(context.system.health.value, context.system.config.penalty.threshold.value, context.system.config.penalty.intervals.health.value),
            morale: calculate(context.system.morale.value, context.system.config.penalty.threshold.value, context.system.config.penalty.intervals.morale.value),
            energy: calculate(context.system.energy.value, context.system.config.penalty.threshold.value, context.system.config.penalty.intervals.energy.value),
            satiety: calculate(context.system.satiety.value, context.system.config.penalty.threshold.value, context.system.config.penalty.intervals.satiety.value),
        }


        context.calculatedPenaltyValues = result;
        context.totalRollPenalty = Math.max(result.health + result.morale + result.energy + result.satiety, 0);
    }

    
    static CalculateWeight(context){
        let carriedWeight = {
            "value": 0,
            _addWeight (weight, quantity) {
                // check we have a valid weight, and do nothing if we do not
                if (!weight || weight == '' || Number.isNaN(weight) || weight <= 0){
                    return;
                }

                // check we have a valid quantity, and do nothing if we do not
                if (!quantity || quantity == '' || Number.isNaN(quantity) || quantity < 0) {
                    return; 
                }
                this.value += weight * quantity;
            }
        };

        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;


            let weight = (i.system.weight) ? i.system.weight.value : 0;
            let quantity = (i.system.quantity) ? i.system.quantity.value : 1;
            
            carriedWeight._addWeight(weight, quantity)
        }

        const cost = context.system.config.cost;

        context.carriedWeight = carriedWeight.value;
        context.actionCost = NumberOrZero(cost.baseActionCost.value) + Math.floor(carriedWeight.value / cost.baseWeightPerActionCost.value);
    }


    static SheetPrepareItems(context){
        
        const inventory = [];
        const skills = [];
        const abilities = [];
        const rollAbilities = [];
        const flaws = [];

        const equipped = {
            weapon: [],
            armor: []
        };

        for (let itm of context.items){
            itm.img = itm.img || DEFAULT_TOKEN;

            if (itm.type === "item"){
                itm.info = game.i18n.localize("ZNZRPG.inventoryQuickInfoQuantity") + " " + NumberOrZero(itm.system.quantity.value);
                inventory.push(itm);
            } 
            else if (itm.type === "weapon"){
                itm.info = game.i18n.localize("ZNZRPG.inventoryQuickInfoDamage") + " " + NumberOrZero(itm.system.damage.value);
                itm.equippable = true;

                if (itm.equipped){
                    equipped.weapon.push(itm);
                } else {
                    equipped.weapon.push(itm);
                    inventory.push(itm);
                }
            }
            else if (itm.type === "armor"){
                itm.info = game.i18n.localize("ZNZRPG.inventoryQuickInfoDefense") + " " + NumberOrZero(itm.system.defense.value);
                itm.equippable = true;

                if (itm.equipped){
                    equipped.weapon.push(itm);
                } else {
                    equipped.weapon.push(itm);
                    inventory.push(itm);
                }
            }
            else if (itm.type === "skill"){
                skills.push(itm);
            }
            else if (itm.type === "ability"){
                abilities.push(itm);
                if (itm.system.roll.length > 0){
                    rollAbilities.push(itm);
                }
            }
            else if (itm.type === "flaw"){
                flaws.push(itm);
            } 
            else {
                inventory.push(itm);
            }
        }

        context.skills = skills;
        context.abilities = abilities;
        context.inventory = inventory;
        context.equipped = equipped;
        context.rollAbilities = rollAbilities;
        context.flaws = flaws;
    }
}