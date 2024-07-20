import { CommandAction } from './_commandAction.js';
import { sendGreenMessage } from '../helpers/messageHelper.js';

/***
 * Use an item
 */
export class UseCommand extends CommandAction {
    static command = "use";

    execute(){
        if (!this.actor || !this.item){
            console.error("No actor/item found for use command");
            return false;
        }

        if (!this.hasItem || !this.item){
            console.error("Must have an item to Use or Consume!");
        }


        //Consumes
        if ("consume" in this.args){
            this.itemWrapper.consumeItem();
            sendGreenMessage(`Using <strong>${this.item.name}</strong> and discarding!`, false, this.actor);
            return true;
        }


        //Base Use
        let result = this.itemWrapper.subtractUses();

        if (result <= 0){
            sendGreenMessage(`Item <strong>${this.item.name}</strong> does not have any uses!`, true, this.actor);
            return false;
        } else if (result == 2){
            sendGreenMessage(`Using <strong>${this.item.name}</strong>. <strong>${this.item.name}</strong> has no more uses!`, false, this.actor);
        } else {
            sendGreenMessage(`Using <strong>${this.item.name}</strong>`, false, this.actor);
        }

        return true;
    }
}