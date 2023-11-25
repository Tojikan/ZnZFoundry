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

    
    static PrepareItems(context){
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
            carriedWeight._addWeight(i.system.weight.value)
        }

        context.carriedWeight = carriedWeight.value;
        context.actionCost = Math.round(carriedWeight.value / context.system.config.cost.baseWeightPerActionCost.value);
    }
}