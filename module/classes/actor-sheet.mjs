import { ActorSheetHelper } from "../helpers/actor-sheet.js";

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

        if (actorData.type == 'character') {
            this._prepareCharacterData(context);
        }
        
        return context;
    }
    
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        function adjustCards(){
            html.find('.items-container.fixed-width').each((i, el) => {
                const cardWidth = 225;
                const count = $(el).find('.znz-card').length;
                const avail = el.clientWidth - 15;

                let widthNeeded = count * cardWidth;
                let diff = widthNeeded - avail;

                // Calculate the margin dynamically based on the available space
                let margin;
                if (count > 1) {
                    // Distribute the remaining space evenly among the cards
                    margin = Math.min(diff / (count - 1), 185); // Limit the maximum margin
                } else {
                    margin = 0; // No margin needed for a single card
                }

                if (widthNeeded < avail) {
                    $(el).removeClass('is-fixed-width');
                    $(el).find('.znz-card:not(:first-child)').css('margin-left', '');
                } else {
                    $(el).addClass('is-fixed-width');
                    $(el).find('.znz-card:not(:first-child)').css('margin-left', -margin + 'px');
                }

            });
        }

        setTimeout(adjustCards, 500);

        html.find('.order-cards').click(ev => {
            setTimeout(adjustCards, 500);
        });




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
            if (confirm("Are you sure you want to delete this item?")){
                item.delete();
                li.slideUp(200, () => this.render(false));
            }
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
        
        //Copy Calculated Values into sheet context
        for (let k in context.document.calculated){
            context[k] = context.document.calculated[k];
        }
        ActorSheetHelper.SheetPrepareItems(context);
    }
    
    
    _createInventoryItem(){

        let sheet = this;

        let d = new Dialog({
            title: "Create New Item",
            content: "<p>Select Item Type.</p>",
            buttons: {
                one: {
                    label: "Consumable",
                    callback: () => {
                        sheet._createItem("consumable");
                    }
                },
                two: {
                    label: "Melee",
                    callback: () => {
                        sheet._createItem("melee_weapon");
                    }
                },
                three: {
                    label: "Ranged",
                    callback: () => {
                        sheet._createItem("ranged_weapon");
                    }
                },
                four: {
                    label: "Wearable",
                    callback: () => {
                        sheet._createItem("wearable");
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

        let created = await Item.create(itemData, {parent: this.actor});

        created.sheet.render(true);
        return created;
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