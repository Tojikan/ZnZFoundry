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
        return `${path}/itemSheet.html`;
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
        return context;
    }
    
    /* -------------------------------------------- */
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        // Roll handlers, click handlers, etc. would go here.
        
        // Delete Inventory Item
        html.find('.item-sheet-delete').click(ev => {
            if (confirm("Are you sure you want to delete this item?")){
                this.object.delete();
            }
        });

        html.find('.item-sheet-action-add').click(ev =>{
            let actions = this.document.system.actions;

            actions.push({
                label: "",
                command: ""
            });

            this.document.update({"system.actions": actions});
        });

        html.find('.item-sheet-action-delete').click(ev =>{
            let ind = $(ev.currentTarget).data('index');
            let actions = this.document.system.actions;
            actions.splice(ind, 1);
            this.document.update({"system.actions": actions});

        });

        html.find('input.action-input-command').change(ev =>{       
            let ind = $(ev.target).data('index');
            let actions = this.document.system.actions;
            actions[ind].command = ev.target.value;
            this.document.update({"system.actions": actions});
        });

        html.find('input.action-input-label').change(ev =>{       
            let ind = $(ev.target).data('index');
            let actions = this.document.system.actions;
            actions[ind].label = ev.target.value;
            this.document.update({"system.actions": actions});
        });
    }
}
