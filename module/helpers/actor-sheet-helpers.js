
import { AddItemCalculated } from "./common.js";

export class ActorSheetHelper {
    static SheetPrepareItems(context){
        const inventory = [];
        const equippedItems = [];
        const traits = [];

        for (let itm of context.items){
            itm.img = itm.img || DEFAULT_TOKEN;

            //calculate use weight
            AddItemCalculated(itm);
            
            if (itm.system.can_be_equipped){
                itm.equippable = true;
            }

            if (itm.type === "skill" || itm.type === "flaw"){
                traits.push(itm);
            } else {
                inventory.push(itm);
            }

            if (itm.system.equipped){
                equippedItems.push(itm);
            }
        }

        context.traits = traits;
        context.inventory = inventory;
        context.equippedItems = equippedItems;
        context.hasEquippedItems = equippedItems.length > 0;
    }

    static SheetPrepareEffects(context){

        let toggleEffects = {};

        for (let effect of context.effects){
            if (effect.name.startsWith('toggle')) {
                toggleEffects[effect.name] = effect.disabled ? false : true;
            }
        }

        context.toggleEffects = toggleEffects;
    }
}

