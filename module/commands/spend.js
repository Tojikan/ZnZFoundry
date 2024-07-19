import { CommandAction } from './_commandAction.js';
import { sendYellowMessage } from '../helpers/messageHelper.js';

/***
 * Add/Subtract resources
 */
export class SpendCommand extends CommandAction {
    static command = "spend";

    execute(){
        if (!this.actor){
            console.error("No actor found for spend command");
            return false;
        }

        if ("undo" in this.args){
            this.characterWrapper.unspendResources();
            sendYellowMessage(`Manually unspending resources!`, this.actor);
            return true;
        } else {
            this.characterWrapper.spendResources(true);
            sendYellowMessage(`Manually spending resources!`, false, this.actor);
        }
        return true;
    }
}