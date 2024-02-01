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
            const parent = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(parent.data("itemId"));
            item.sheet.render(true);
        });
        
        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        //Create Inventory Item
        html.find('.item-create').click(ev => {
            const type = $(ev.currentTarget).data("type");

            if (type === 'inventory'){
                this._createInventoryItem(this);
            } else {
                this._createItem(type);
            }
        });

        
        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });

        // Equip Inventory Item
        html.find('.item-equip').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            

            if ('equipped' in item.system){
                item.update({"system.equipped": true});
            }
            li.slideUp(200, () => this.render(false));
        }); 

        // Equip Inventory Item
        html.find('.item-unequip').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));

            if ('equipped' in item.system){
                item.update({"system.equipped": false});
            }

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
    
    
    _createInventoryItem(){

        let d = new Dialog({
            title: "Create New Item",
            content: "<p>Select Item Type.</p>",
            buttons: {
                one: {
                    label: "Item",
                    callback: () => {
                        this._createItem("item");
                    }
                },
                two: {
                    label: "Melee",
                    callback: () => {
                        this._createItem("melee_weapon");
                        console.log(this);
                    }
                },
                three: {
                    label: "Ranged",
                    callback: () => {
                        this._createItem("ranged_weapon");
                    }
                },
                four: {
                    label: "Armor",
                    callback: () => {
                        this._createItem("armor");
                    }
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
        let label = type.capitalize();

        if (type === "melee_weapon"){
            label = "Melee Weapon";
        } else if (type === "ranged_weapon"){
            label = "Ranged Weapon";
        }

        // Initialize a default name.
        const name = `New ${label}`;
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
        console.log(event);
        console.log(dataset);
    }
}