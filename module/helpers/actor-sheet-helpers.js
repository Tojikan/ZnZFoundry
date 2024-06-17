
import { AddItemCalculated } from "./common.js";

export class ActorSheetHelper {
    static SheetPrepareItems(context){
        const inventory = [];
        const equippedItems = [];
        const skills = [];
        const flaws = [];

        for (let itm of context.items){
            itm.img = itm.img || DEFAULT_TOKEN;

            //calculate use weight
            AddItemCalculated(itm);
            
            if (itm.system.can_be_equipped){
                itm.equippable = true;
            }

            if (itm.system.equipped){
                equippedItems.push(itm);
            } else if (itm.type === "skill"){
                skills.push(itm);
            } else if (itm.type === "flaw"){
                flaws.push(itm);
            } else {
                inventory.push(itm);
            }
        }
        
        context.skills = skills;
        context.flaws = flaws;
        context.inventory = inventory;
        context.equippedItems = equippedItems;
        context.hasEquippedItems = equippedItems.length > 0 || flaws.length > 0 || skills.length > 0;
    }
}