import { CommandAction } from './_commandAction.js';
import { sendGreenMessage, sendRedMessage } from '../helpers/messageHelper.js';

/***
 * Reload a weapon by finding a card
 * 
 * No longer being used but maybe one day...
 */
export class ReloadCommand extends CommandAction {
    static command = "reload";

    execute(){
        if (!this.actor){
            console.error("No actor found for reload command");
            return false;
        }

        if (!this.hasItem || !this.item){
            console.error("Must have a weapon to reload!");
            return false;
        }

        let itemType = this.itemWrapper.getAmmoType();

        if (!itemType){
            console.error("Invalid weapon type");
            return false;
        }

        let needed = this.itemWrapper.getAmountToReload();
        let used = this.characterWrapper.useAmmo(itemType, needed);

        if (used == 0){
            sendRedMessage(`Tried to reload but is out of ${itemType} ammo!`, false, this.actor);
            return true;
        } 

        this.itemWrapper.reloadAmmo(used);
        sendGreenMessage(`Reloaded ${this.item.name} with ${used} ${itemType} ammo!`, false, this.actor);
    }
}