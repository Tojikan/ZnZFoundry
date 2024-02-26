

export class ActorSheetHelper {
    static SheetPrepareItems(context){
        const inventory = [];
        const equippedItems = [];

        for (let itm of context.items){
            itm.img = itm.img || DEFAULT_TOKEN;
            
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