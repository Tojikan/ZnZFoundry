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
            health: calculate(context.system.health.value, context.system.config.penalty.thresholds.health.value, context.system.config.penalty.intervals.health.value),
            morale: calculate(context.system.morale.value, context.system.config.penalty.thresholds.morale.value, context.system.config.penalty.intervals.morale.value),
            energy: calculate(context.system.energy.value, context.system.config.penalty.thresholds.energy.value, context.system.config.penalty.intervals.energy.value),
            satiety: calculate(context.system.satiety.value, context.system.config.penalty.thresholds.satiety.value, context.system.config.penalty.intervals.satiety.value)
        };
        

        let calculatedPenaltyValues = result;
        let totalRollPenalty = Math.max(result.health + result.morale + result.energy + result.satiety, 0);
        let calculatedDiceFace = Math.max(context.system.config.baseDiceFace.value - totalRollPenalty, 1);
        let isNegativeDiceFace = calculatedDiceFace < context.system.config.baseDiceFace.value;

        context.calculated.calculatedPenaltyValues = calculatedPenaltyValues;
        context.calculated.totalRollPenalty = totalRollPenalty;
        context.calculated.calculatedDiceFace = calculatedDiceFace;
        context.calculated.calculatedDiceFace = calculatedDiceFace;
        context.calculated.isNegativeDiceFace = isNegativeDiceFace;
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
        
        context.calculated.carriedWeight = carriedWeight.value;
    }
    
    static CalculateCost(context){
        const cost = context.system.config.cost;
        context.calculated.satietyCost = NumberOrZero(cost.baseSatietyCost.value) + Math.floor(context.calculated.carriedWeight / cost.baseWeightPerActionCost.value);
        context.calculated.energyCost = NumberOrZero(cost.baseEnergyCost.value) + Math.floor(context.calculated.carriedWeight / cost.baseWeightPerActionCost.value);
    }

    static CalculateSlots(context){
        let totalSlots = NumberOrZero(context.system.baseEquipmentSlots.value);
        let equippedItemCount = 0;

        for (let itm of context.items) {
            if (itm.equipslots){
                totalSlots += NumberOrZero(itm.equipslots.value);
            }

            if (itm.system.equipped){
                equippedItemCount++;
            }
        }

        context.calculated.totalSlots = totalSlots;
        context.calculated.equippedItemCount = equippedItemCount;
        context.calculated.overEquipped = equippedItemCount > totalSlots;
    }
}