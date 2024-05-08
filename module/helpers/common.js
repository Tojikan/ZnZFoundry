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
    itemContext.calculated.weight = itemContext.system.weight.value;
    let usesWeight = ItemUsesWeightCalculator(itemContext);
    if (usesWeight.value > 0){
        itemContext.calculated.weight += usesWeight.value;
    }
}