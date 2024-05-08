
import { AddItemCalculated } from "./common.js";

export class ActorSheetHelper {
    static SheetPrepareItems(context){
        const inventory = [];
        const equippedItems = [];
        const equippedWearables = [];

        for (let itm of context.items){
            itm.img = itm.img || DEFAULT_TOKEN;

            //calculate use weight
            AddItemCalculated(itm);
            
            if (itm.system.can_be_equipped){
                itm.equippable = true;
            }

            if (itm.system.equipped){
                equippedItems.push(itm);
            } else {
                inventory.push(itm);
            }
        }
        
        context.inventory = inventory;
        context.equippedItems = equippedItems;
        context.hasEquippedItems = equippedItems.length > 0;
    }
}