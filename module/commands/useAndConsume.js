import { CommandAction } from './_commandAction.js';
import { sendGreenMessage } from '../helpers/messageHelper.js';

/***
 * Use an item
 */
export class UseAndConsumeCommand extends CommandAction {
    execute(){

        if (!this.hasItem || !this.item){
            console.error("Must have an item to Use or Consume!");
        }

        //Uses
        if (this.name == "use"){

            let result = this.itemWrapper.subtractUses();

            if (result <= -1){
                sendGreenMessage(`Item <strong>${this.item.name}</strong> does not have any uses!`, true, this.actor);
                return false;
            } else if (result == 0){
                sendGreenMessage(`No uses left for <strong>${this.item.name}</strong>`, true, this.actor);
                return false;
            } else if (result == 2){
                sendGreenMessage(`Using <strong>${this.item.name}</strong>. <strong>${this.item.name}</strong> has no more uses!`, false, this.actor);
            } else {
                sendGreenMessage(`Using <strong>${this.item.name}</strong>`, false, this.actor);
            }

            return true;
        }

        //Consumes
        if (this.name == "consume"){
            this.itemWrapper.consumeItem();
            sendGreenMessage(`Using <strong>${this.item.name}</strong> and discarding!`, false, this.actor);
            return true;
        }

    }
}