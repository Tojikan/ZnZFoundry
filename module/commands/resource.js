import { CommandAction } from './_commandAction.js';
import { sendGreenMessage } from '../helpers/messageHelper.js';

/***
 * Add/Subtract resources
 */
export class ResourceCommand extends CommandAction {
    static command = "resource";

    execute(){
        if (!this.actor){
            console.error("No actor found for reload command");
            return false;
        }

        let restores = {};
        let acceptedVals = ["health", "satiety", "energy", "morale"];

        for (let key in this.args){
            if (acceptedVals.includes(key) && !isNaN(this.args[key])){
                restores[key] = parseFloat(this.args[key]);
            } else {
                restores[key] = 0;
            }
        }

        let restoreMsg = "";
        for (let key in restores){
            let verb = "Gain";

            if (restores[key] < 0){
                verb = "Lose";
            }

            restoreMsg += `<div>${verb} ${Math.abs(restores[key])} ${key.charAt(0).toUpperCase() + key.slice(1)}</div> `;
        }

        let msg = "";


        if (this.hasItem){
            if (this.item.system.hasUses){
                let result = this.itemWrapper.subtractUses();

                if (result <= -1){
                    sendGreenMessage(`Item <strong>${this.item.name}</strong> does not have any uses!`, true, this.actor);
                    return false;
                } else if (result == 0){
                    sendGreenMessage(`No uses left for <strong>${this.item.name}</strong>`, true, this.actor);
                    return false;
                } else if (result == 2){
                    msg += `Using <strong>${this.item.name}</strong>. <strong>${this.item.name}</strong> has no more uses left!`
                } else {
                    msg += `Using <strong>${this.item.name}</strong>.`;
                }
            } else {
                this.itemWrapper.consumeItem();
                msg += `Using <strong>${this.item.name}</strong> and discarding!`;
            }
        }

        msg += "<br/>";
        msg += restoreMsg;

        sendGreenMessage(msg, false, this.actor);
        this.characterWrapper.addResources(restores);

        return true;
    }
}