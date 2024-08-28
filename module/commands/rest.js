import { CommandAction } from './_commandAction.js';
import { sendGreenMessage } from '../helpers/messageHelper.js';

/***
 * Use an item
 */
export class RestCommand extends CommandAction {
    static command = "rest";

    execute(){
        console.log(this);

        if (!this.actor){
            console.error("No actor found for rest command");
            return false;
        }

        this.restDialog();

    }

    doRest(hours){
        if (isNaN(hours) || hours <= 0){
            ui.notifications.error("You must specify a number above zero");
            return;
        }

        let hrs = Math.max(parseInt(hours), 0);

        let restResult = this.characterWrapper.rest(hrs);

        if (!restResult || !restResult.energyAdded){
            ui.notifications.error("Error resting");
            return;
        }

        let msg = `Rested for ${hrs} hours to restore ${restResult.energyAdded} energy! <br/>`;
        sendGreenMessage(msg, false, this.actor);
    }

    restDialog(){
        new Dialog({
            title: "Rest",
            content: `
                <form>
                    <div>Hours needed to reach Long Rest: <strong>${this.actor.system.config.hoursForLongRest.value}</strong></div>
                    <div class="form-group">
                        <label>Rest for how many hours?</label>
                        <input style="max-width: 100px" type='number' name='restHours' min='0' max='10' step='1'></input>
                    </div>
                </form>
                <br/><br/>
            `,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: "Rest",
                    callback: (html) => {
                        let restHours = html.find("input[name='restHours']")[0].value;
                        this.doRest(restHours);
                    }
                },
            },
            default: "yes"
          }).render(true);
    }
}