import { NumberOrZero, WeightCalculator, ItemUsesWeightCalculator } from "./common.js";

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
        let carriedWeight = WeightCalculator();

        for (let i of context.items) {
            if (i.type === "flaw" || i.type === "skill" || i.skill === "ability") continue;
            i.img = i.img || DEFAULT_TOKEN;


            let weight = (i.system.weight) ? i.system.weight.value : 0;
            let quantity = (i.system.quantity) ? i.system.quantity.value : 1;
            
            carriedWeight._addWeight(weight, quantity)

            ItemUsesWeightCalculator(i, carriedWeight);
        }

        let ammoStore = context.system.ammoStore;
        let ammoWeight = context.system.config.ammoWeight;

        carriedWeight._addWeight(ammoWeight.light.value, ammoStore.light.value);
        carriedWeight._addWeight(ammoWeight.medium.value, ammoStore.medium.value);
        carriedWeight._addWeight(ammoWeight.heavy.value, ammoStore.heavy.value);
        
        context.calculated.carriedWeight = carriedWeight.value;
    }
    
    static CalculateCost(context){
        const cost = context.system.config.cost;
        context.calculated.healthCost = 0;
        context.calculated.satietyCost = NumberOrZero(cost.baseSatietyCost.value) + Math.floor(context.calculated.carriedWeight / cost.baseWeightPerActionCost.value);
        context.calculated.energyCost = NumberOrZero(cost.baseEnergyCost.value) + Math.floor(context.calculated.carriedWeight / cost.baseWeightPerActionCost.value);
        context.calculated.moraleCost = NumberOrZero(cost.baseMoraleCost.value);

  
        let staCost = context.calculated.satietyCost;
        let energyCost = context.calculated.energyCost;
        let moraleCost = context.calculated.moraleCost;
        let sta = context.system.satiety.value;
        let energy = context.system.energy.value;
        let mor = context.system.morale.value;


        //Spend health if we don't have enough of any resource
        if (sta < staCost){
            context.calculated.healthCost += staCost - sta;
        }
        if (energy < energyCost){
            context.calculated.healthCost += energyCost - energy;
        }
        if (mor < moraleCost){
            context.calculated.healthCost += moraleCost - mor;
        }
    }

    static CalculateSlots(context){
        let totalSlots = NumberOrZero(context.system.baseEquipmentSlots.value);
        let equippedItemCount = 0;

        for (let itm of context.items) {
            if (itm.system.equipslots){
                totalSlots += NumberOrZero(itm.system.equipslots.value);
            }

            if (itm.system.equipped){

                if (itm.type === "flaw" || itm.type === "skill") continue;
                
                equippedItemCount++;
            }
        }

        context.calculated.totalSlots = totalSlots;
        context.calculated.equippedItemCount = equippedItemCount;
        context.calculated.overEquipped = equippedItemCount > totalSlots;
    }

    //Has to be called after CalculateSlots and Calculate Cost
    static CalculateSlotCostPenalty(context){
        if (context.calculated.overEquipped){
            let total = context.calculated.equippedItemCount - context.calculated.totalSlots;

            context.calculated.satietyCost += total;
            context.calculated.energyCost += total;
            context.calculated.moraleCost += total;
        }
    }

    static CalculateDamageReduction(context){
        let totalReduction = 0;

        for (let itm of context.items) {

            if (itm.system.equipped && itm.system.damageReduction && itm.system.durability.value > 0){
                totalReduction += itm.system.damageReduction.value;
            }
        }

        totalReduction = Math.max(totalReduction, 0);
        context.calculated.totalDamageReduction = Math.min(totalReduction, context.system.config.maxDamageReduction.value);
    }
}