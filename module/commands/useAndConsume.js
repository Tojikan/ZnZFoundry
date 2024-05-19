import { CommandAction } from './_commandAction.js';

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
                this.sendMessage(`Item <strong>${this.item.name}</strong> does not have any uses!`, true);
                return false;
            } else if (result == 0){
                this.sendMessage(`No uses left for <strong>${this.item.name}</strong>`, true);
                return false;
            } else if (result == 2){
                this.sendMessage(`Using <strong>${this.item.name}</strong>. <strong>${this.item.name}</strong> has no more uses!`);
            } else {
                this.sendMessage(`Using <strong>${this.item.name}</strong>`);
            }

            return true;
        }

        //Consumes
        if (this.name == "consume"){
            this.itemWrapper.consumeItem();
            this.sendMessage(`Using <strong>${this.item.name}</strong> and discarding!`);
            return true;
        }

    }

    sendMessage(msg, isError){
        let color = "#abf7b1";
        if (isError){
            color = "#ff9e9e";
        }
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.item.actor }),
            content: `<div style='background-color:${color}'>${msg}</div>`,
        });
    }

}