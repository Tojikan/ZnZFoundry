import { CommandAction } from './_commandAction.js';
import { sendGreenMessage, sendRedMessage } from '../helpers/messageHelper.js';
import { ItemWrapper } from '../obj/ItemWrapper.js';

/***
 * Calculate Damage based on armor reduction
 */
export class CalculateDamageCommand extends CommandAction {
    static command = "calculateDamage";

    execute(){
        if (!this.actor){
            console.error("No actor found for calculate Damage command");
            return false;
        }

        this.calculateDialog();
    }

    calculateDialog(){
        let buttons = {};

        buttons[`button1`] = {
            label: "Calculate",
            callback: () => {
                sendGreenMessage(`Calculated damage for ${this.item.name}: ${damage} ${damageType}`, false, this.actor);
            }
        };

        new Dialog({
            title: "Calculate Damage",
            content: `
<form>
    <div>You will lose durability on equipped wearables.</div>
    <div class="form-group">
        <label for="damage">Damage Taken:</label>
        <input type="number" data-dtype="Number"  id="damage"/>     
    </div>
</form>
`,
            buttons: {
                calculate: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Calculate",
                    callback: ($html) => {
                        let input = $html.find('#damage').val();
                        this.calculateDamage(input);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                }
            },
            default: "button1"
          }).render(true);
    }

    calculateDamage(dmg){
        if (isNaN(dmg) || dmg < 0){
            sendRedMessage("Invalid damage amount", false, this.actor);
            return;
        }

        let damage = dmg;
        let reduce = this.actor.calculated.totalDamageReduction * 0.01;
        let maxReduce = this.actor.system.config.maxDamageReduction.value * 0.01;

        reduce = Math.min(reduce, maxReduce);
        
        let damageTaken = dmg * (1 - reduce);
        damageTaken = Math.floor(damageTaken);

        if (damageTaken < 0){
            damageTaken = 0;
        }

        this.characterWrapper.takeDamage(damageTaken);

        let wearables = this.characterWrapper.getItems("wearable", true);

        for (let w of wearables){
            let wrapper = new ItemWrapper(w);
            wrapper.spendDurability("defend", true);
        }

        sendGreenMessage(`${this.actor.name} received ${dmg} damage but reduced it to <strong>${damageTaken}</strong> with armor (${reduce * 100}% reduction).`, false, this.actor);
    }
}