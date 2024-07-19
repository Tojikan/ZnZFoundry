import { CommandAction } from './_commandAction.js';
import { sendGreenMessage } from '../helpers/messageHelper.js';

/***
 * Reload a weapon by finding a card
 * 
 * No longer being used but maybe one day...
 */
export class ReloadFindCommand extends CommandAction {
    static command = "reloadfind";

    execute(){

        if (!this.actor){
            console.error("No actor found for reload command");
            return false;
        }

        ui.notifications.info("Unknown reload type");
        return false;
    }

    reloadDialog(items, reloadFn){
        let buttons = {};

        for (let i = 0; i < items.length; i++){
            let weapon = items[i];
            buttons[`button${i}`] = {
                label: weapon.name,
                callback: () => {
                    reloadFn(this, weapon, this.item, this.actor);
                }
            };
        }

        new Dialog({
            title: "Reload Weapon",
            content: "Select a weapon to reload.",
            buttons: buttons,
            default: "button1"
          }).render(true);
    }


    //action functions
    fullReload(context, weaponItem, ammoItem, actor){
        let success = context.reloadWeaponFull(weaponItem);

        if (success){
            sendGreenMessage(`Fully Reloading ${weaponItem.name}`, false, actor);

            if(ammoItem){
                sendGreenMessage(`Using and discarding ${ammoItem.name}`, false, actor);
                ammoItem.delete();
            }
        }
    }

    usesReload(context, weaponItem, ammoItem, actor){
        if (!ammoItem){
            sendGreenMessage("No ammo item selected to reload weapon.", true, actor);
            return;
        }

        if (!ammoItem.system.uses){
            sendGreenMessage("Ammo item does not have uses.", true, actor);
            return;
        }

        let success = context.reloadWeaponUses(weaponItem, ammoItem);

        if (success){
            sendGreenMessage(`Reloading ${weaponItem.name} with ${ammoItem.name}`, false, actor);

            if (ammoItem.system.uses.current <= 0){
                sendGreenMessage(`No uses left for ${ammoItem.name}.`, false, actor);
            }
        }
    }


    // Functions for reloading
    reloadWeaponUses(itemToReload, ammoItem){
        if (itemToReload.type !== 'ranged_weapon'){
            console.error("Item is not a ranged weapon!");
            return false;
        }

        let ammo = itemToReload.system.ammo;
        let ammoMax = ammo.max;
        let ammoCurrent = ammo.current;

        let uses = ammoItem.system.uses;
        let usesCurrent = uses.current;

        if (ammoCurrent == ammoMax){
            ui.notifications.info("Weapon is already fully loaded.");
            return false;
        }

        if (usesCurrent <= 0){
            ui.notifications.info("No ammo left to reload weapon.");
            return false;
        }

        let newAmmo = Math.min(ammoMax, ammoCurrent + usesCurrent);
        let newUses = Math.max(0, usesCurrent - (newAmmo - ammoCurrent));

        itemToReload.update({"system.ammo.current": newAmmo});
        ammoItem.update({"system.uses.current": newUses});
        return true;
    }


    reloadWeaponFull(item){
        if (item.type !== 'ranged_weapon'){
            console.error("Item is not a ranged weapon!");
            return false;
        }

        let ammo = item.system.ammo;
        let ammoMax = ammo.max;
        let ammoCurrent = ammo.current;

        if (ammoCurrent == ammoMax){
            ui.notifications.info("Weapon is already fully loaded.");
            return false;
        }
        

        item.update({"system.ammo.current": ammoMax});
        return true;
    }
}