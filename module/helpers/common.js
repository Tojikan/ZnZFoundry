export  function NumberOrZero(str) {
    if (isNaN(str) || isNaN(parseFloat(str))){
        return 0;
    } 
    return parseFloat(str);
}

export function WeightCalculator(){
    return {
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
            if (!Number.isInteger(this.value)) {
                this.value = Math.round(this.value * 10) / 10;
            }
        }
    };
}

export function ItemUsesWeightCalculator(item, weightCalc = null){
    if (!weightCalc) {
        weightCalc = WeightCalculator();
    }

    if (item.system.hasUses && item.system.usesWeight && item.system.usesWeight.value > 0 && item.system.uses && item.system.uses.current > 0){
        weightCalc._addWeight(item.system.usesWeight.value, item.system.uses.current);
    }

    return weightCalc;
}

export function AddItemCalculated(itemContext){
    itemContext.calculated = {};

    if (!itemContext.system.weight){
        return;
    }

    itemContext.calculated.weight = itemContext.system.weight.value;
    let usesWeight = ItemUsesWeightCalculator(itemContext);
    if (usesWeight.value > 0){
        itemContext.calculated.weight += usesWeight.value;
    }
}

export function findItem(itemId){
    let item = game.items.get(itemId);
    if (item) return item;

    for (let actor of game.actors.contents) {
        item = actor.items.get(itemId);
        if (item) return item;
    }

    return null;
}