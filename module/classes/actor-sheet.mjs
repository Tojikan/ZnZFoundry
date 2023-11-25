import { CharacterHelper } from "../helpers/character.js";


export class ZnZActorSheet extends ActorSheet {
    
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["znz4e", "sheet", "actor"],
            template: "systems/znz4e/templates/actor/actor-sheet.html",
            width: 800,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "equipment" }]
        });
    }
    
    /** @override */
    get template() {
        return `systems/znz4e/templates/actor/actor-${this.actor.type}-sheet.html`;
    }
    
    
    async getData(options) {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();

        // enrichedDescription - enriches system.description for editor
        context.enrichedDescription = await TextEditor.enrichHTML(this.object.system.description, {async: true});
        
        // Use a safe clone of the actor data for further operations.
        const actorData = this.actor.toObject(false);
        
        // Add the actor's data to context.data for easier access, as well as flags.
        context.data = actorData.system;
        context.flags = actorData.flags;
        
        context.enrichedDescription = await TextEditor.enrichHTML(context.data.description, {async: true});
        
        if (actorData.type == 'character') {
            this._prepareCharacterData(context);
        }
        
        return context;
    }
    
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });
        
        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;
        
        // Add Inventory Item
        html.find('.item-create').click(this._onCreateClick.bind(this));
        
        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });
        
        // Rollable abilities.
        html.find('.rollable').click(this._onRoll.bind(this));
        
        // Drag events for macros.
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }
    
    
    
    
    /**
    * Prepare Character type specific data
    */
    _prepareCharacterData(context) {
        //Copy from Character
        context.carriedWeight = context.document.carriedWeight;
        context.calculatedPenaltyValues = context.document.calculatedPenaltyValues;
        context.totalRollPenalty = context.document.totalRollPenalty
        context.actionCost = context.document.actionCost;
        
        
        CharacterHelper.SheetPrepareItems(context);
    }
    
    
    _onCreateClick(){

        let d = new Dialog({
            title: "Create New Item",
            content: "<p>Select Item Type.</p>",
            buttons: {
                one: {
                    label: "Item",
                    callback: () => this._createItem("item")
                },
                two: {
                    label: "Weapon",
                    callback: () => this._createItem("weapon")
                },
                three: {
                    label: "Armor",
                    callback: () => this._createItem("armor")
                }
            },
            default: "one",
        });
        d.render(true);
    }
    
    
    /**
    * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
    * @param {Event} event   The originating click event
    * @private
    */
    async _createItem(type) {
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type
        };
        
        // Finally, create the item!
        return await Item.create(itemData, {parent: this.actor});
    }
    
    /**
    * Handle clickable rolls.
    * @param {Event} event   The originating click event
    * @private
    */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        
        console.log(dataset);
    }
}