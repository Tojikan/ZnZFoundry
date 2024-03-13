export class ZnZRoll {
    constructor(actor, item, attr, skill, itemMulti){
        this.actor = actor;
        this.item = item;

        this.getAttribute(attr);
        this.getSkill(skill);
        this.getItemMulti(itemMulti);
    }

    getActorData(){
        this.baseDiceFace = this.actor.calculated.calculatedDiceFace;
    }

    getAttribute(attr){
        if (!(attr in this.actor.system.attributes)){
            ui.notifications.warn(game.i18n.localize("ZNZRPG.attrNotFoundText"));
            throw new Error("AttributeNotFound");
        }
        let attribute = this.actor.system.attributes[attr];
        this.attrVal = attribute.value;
        this.attrLabel = game.i18n.localize(attribute.label);
    }


    getSkill(skill){
        if (!skill || skill === ""){
            this.skillVal = 0;
            this.skillLabel = "";
            return;
        }

        const baseSkills = this.actor.system.baseSkills;

        if (!(skill in baseSkills)){
            ui.notifications.warn(game.i18n.localize("ZNZRPG.skillNotFoundText"));
            throw new Error("SkillNotFound");
        }

        let skill = baseSkills[skill];

        this.skillVal = skill.value ?? 0;
        this.skillLabel = game.i18n.localize(skill.label);
    }

    getItemMulti(itemMulti){
        if (!itemMulti || itemMulti === ""){
            this.itemMultiVal = 0;
            this.itemMultiLabel = "";
        }

        if (!(itemMulti in this.item.system)){
            ui.notifications.warn(game.i18n.localize("ZNZRPG.itemMultiNotFoundText"));
            throw new Error("ItemMultiNotFound");
        }

        this.itemMultiVal = this.item.system[itemMulti].value;
        this.itemMultiLabel = game.i18n.localize(this.item.system[itemMulti].label);

        return this.item.system[itemMulti].value;
    }

    async roll(){
        let numOfDice = this.attrVal;
        let diceFace = this.baseDiceFace + this.skillVal;

        let formula = `${numOfDice}d${diceFace}`;

        const rollData = this.actor.getRollData();

        let roll = new Roll(formula, rollData);


        //Item Roll - has multiplier
        if (itemMulti > 0){
            let rollResult = await roll.roll();

            let templateContext = {
                roll: rollResult,
                actor: this.actor,
                item: this.item,
                itemMulti: this.itemMultiVal,
                itemMultiLabel: this.itemMultiLabel,
                skillVal: this.skillVal,
                skillLabel: this.skillLabel
            };

            let messageData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: `Rolling ${attrLabel}`,
                content: await renderTemplate("systems/znz4e/templates/chat/itemRoll.hbs", templateContext),
                test: "test123"
            };

            return ChatMessage.create(messageData);
        }


        //Basic roll - just roll attribute
        return roll.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `Rolling ${attrLabel}`
        });
    }
}