import { ZNZLISTS } from "../config.js";


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
            _addWeight (moreWeight, quantity) {
                if (!quantity || quantity == '' || Number.isNaN(quantity) || quantity < 0) {
                    return; // check we have a valid quantity, and do nothing if we do not
                }

                let q = Math.floor(quantity / 10);

                if (!Number.isNaN(parseFloat(moreWeight))) {
                    this.value += parseFloat(moreWeight) * quantity;
                } else if (moreWeight === '*' && q > 0) {
                    this.value += q;
                }
            }
        };

        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;

            if (ZNZLISTS.noWeightItems.includes(i.type)){
                continue;
            }
            
            carriedWeight._addWeight(i.system.weight.value, i.system.quantity.value)
        }

        context.carriedWeight = carriedWeight.value;
        context.actionCost = Math.round(carriedWeight.value / context.system.config.cost.baseWeightPerActionCost.value);
    }


    static SheetPrepareItems(context){
        const inv = {
            item: [],
            weapon: [],
            armor: [],
        };

        const skills = [];
        const abilities = [];

        const equipped = {
            weapon: [],
            armor: []
        };

    
        for (let itm of context.items){
            itm.img = itm.img || DEFAULT_TOKEN;

            if (itm.type === "item"){
                itm.info = game.i18n.localize("ZNZRPG.inventoryQuickInfoQuantity") + " " + itm.system.quantity.value;
                inv.item.push(itm);
            } 
            else if (itm.type === "weapon"){
                itm.info = game.i18n.localize("ZNZRPG.inventoryQuickInfoDamage") + itm.system.damage.value;
                itm.equippable = true;

                if (itm.equipped){
                    equipped.weapon.push(itm);
                } else {
                    inv.weapon.push(itm);
                }
            }
            else if (itm.type === "armor"){
                itm.equippable = true;

                if (itm.equipped){
                    equipped.weapon.push(itm);
                } else {
                    inv.weapon.push(itm);
                }
            }
            else if (itm.type === "skill"){
                skills.push(itm);
            }
            else if (itm.type === "ability"){
                abilities.push(itm);
            }
        }

        context.inventory = [...inv.item, ...inv.weapon, ...inv.armor];
        context.equipped = equipped;
    }
}