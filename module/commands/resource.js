import { CommandAction } from './_commandAction.js';
import { sendGreenMessage } from '../helpers/messageHelper.js';

/***
 * Add/Subtract resources
 */
export class ResourceCommand extends CommandAction {
    execute(){
        let restores = {};
        let acceptedVals = ["health", "satiety", "energy", "morale"];

        for (let key in this.args){
            if (acceptedVals.includes(key) && !isNaN(this.args[key])){
                restores[key] = parseFloat(this.args[key]);
            } else {
                restores[key] = 0;
            }
        }


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
                    sendGreenMessage(`Using <strong>${this.item.name}</strong>. <strong>${this.item.name}</strong> has no more uses!`, false, this.actor);
                } else {
                    sendGreenMessage(`Using <strong>${this.item.name}</strong>`, false, this.actor);
                }
            } else {
                this.itemWrapper.consumeItem();
                sendGreenMessage(`Using <strong>${this.item.name}</strong> and discarding!`, false, this.actor);
            }
        }

        this.characterWrapper.addResources(restores);

        return true;
    }
}