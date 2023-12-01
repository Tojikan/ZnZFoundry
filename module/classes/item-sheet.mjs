/**
* Extend the basic ItemSheet with some very simple modifications
* @extends {ItemSheet}
*/
export class ZnZItemSheet extends ItemSheet {
    
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["znz4e", "sheet", "item"],
            width: 520,
            height: 480
        });
    }
    
    /** @override */
    get template() {
        const path = "systems/znz4e/templates/item";
        return `${path}/${this.item.type}-sheet.html`;
    }
    
    /* -------------------------------------------- */
    
    /** @override */
    async getData() {
        // Retrieve base data structure.
        const context = super.getData();
        
        // enrichedDescription - enriches system.description for editor
        context.enrichedDescription = await TextEditor.enrichHTML(this.object.system.description, {async: true});

        // Use a safe clone of the item data for further operations.
        const itemData = context.item;
        
        // Retrieve the roll data for TinyMCE editors.
        context.rollData = {};
        let actor = this.object?.parent ?? null;
        if (actor) {
            context.rollData = actor.getRollData();
        }
        
        // Add the actor's data to context.data for easier access, as well as flags.
        context.data = itemData.system;
        context.flags = itemData.flags;


        context.ActorAttributes = game.template.Actor.character.attributes;
        context.AmmoTypes = game.template.Actor.character.inventory.ammo;
        context.WeaponTypes = game.template.Item.weapon.weaponType.options;
        return context;
    }
    
    /* -------------------------------------------- */
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        // Roll handlers, click handlers, etc. would go here.
    }
}
