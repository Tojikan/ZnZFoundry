import { ActorSheetHelper } from "../helpers/actor-sheet-helpers.js";
import { CommandInterpreter } from "../commands/_commandInterpreter.js";
import { manageToggleEffect } from "../helpers/effects.js";

export class ZnZActorSheet extends ActorSheet {
    
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
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
        context.effects = actorData.effects;

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
                const cardWidth = 250;
                const count = $(el).find('.znz-card:visible').length;
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

        setTimeout(adjustCards, 100);

        html.find('.order-cards').click(ev => {
            setTimeout(adjustCards, 100);
        });


        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').click(ev => {
            const parent = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(parent.data("itemId"));
            item.sheet.render(true);
        });

        html.find('.filter-button').click(ev => {
            const filter = $(ev.currentTarget).data("filter");
            let filterTarget = $(ev.currentTarget).data("filter-target") ?? "";

            if (filterTarget.length){
                filterTarget = '.' + filterTarget;
            }

            const items = html.find(filterTarget + ' .znz-card.item');

            $(ev.currentTarget).parent('.equipment-filter').siblings('.equipment-filter').find('.filter-button').removeClass('active');
            $(ev.currentTarget).addClass('active');

            if (filter === 'all'){
                items.show();
            } else {
                items.hide();
            }

            for (let itm of items){
                if (filter === 'equipment'){
                    if( itm.classList.contains('melee_weapon') || itm.classList.contains('ranged_weapon') || itm.classList.contains('consumable')){
                        $(itm).show();
                    }
                } else if (filter === 'weapon'){
                    if( itm.classList.contains('melee_weapon') || itm.classList.contains('ranged_weapon')){
                        $(itm).show();
                    }
                } else if (filter === 'consumable'){
                    if( itm.classList.contains('consumable')){
                        $(itm).show();
                    }
                } else if (filter === 'wearable'){
                    if( itm.classList.contains('wearable')){
                        $(itm).show();
                    }
                } else if (filter === 'skill'){
                    if( itm.classList.contains('skill')){
                        $(itm).show();
                    }
                } else if (filter === 'flaw'){
                    if( itm.classList.contains('flaw')){
                        $(itm).show();
                    }
                } else if (filter === 'trait'){
                    if( itm.classList.contains('skill') || itm.classList.contains('flaw')){
                        $(itm).show();
                    }
                }
            }
            adjustCards();
        });


        
        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        //Create Inventory Item
        html.find('.item-create').click(ev => {
            const type = $(ev.currentTarget).data("type");

            if (type === 'inventory'){
                this._createInventoryItem(this);
            } else if (type === 'trait'){
                this._createTraitItem(this);
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

        html.find('.toggle-effect').click(ev => {
            manageToggleEffect(ev, this.actor);
        });
        
        // Drag events for macros.
        if (this.actor.isOwner) {
            let handler = ev => {

                const el = ev.currentTarget;

                if (el.hasAttribute("data-zmacro")){
                    const itemId = el.getAttribute("data-item-id");
                    const command = el.getAttribute("data-command");
                    const macroName = el.getAttribute("data-zmacro") ?? "New Macro";

                    let data = {
                        type: "zmacro",
                        name: macroName
                    };

                    if (itemId) data.itemId = itemId;
                    if (command) data.command = command;
                    data.actorId = this.actor.id;

                    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
                    return;
                }

                this._onDragStart(ev);
            };

            html.find('.rollable').each((i, li) => {
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
        ActorSheetHelper.SheetPrepareEffects(context);
    }

    _createTraitItem(){
        let sheet = this;

        let d = new Dialog({
            title: "Create New Trait",
            content: "<p>Select Trait Type.</p>",
            buttons: {
                one: {
                    label: "Skill",
                    callback: () => {
                        sheet._createItem("skill");
                    }
                },
                two: {
                    label: "Flaw",
                    callback: () => {
                        sheet._createItem("flaw");
                    }
                }
            },
            default: "one",
        });
        d.render(true);
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
        const $el = $(event.currentTarget);
        const command = $el.data("command");
        const itemId = $el.data("itemId");
        let item = null;

        if (itemId && itemId.length){
            item = this.actor.items.get(itemId);
        }

        this.runCommand(command, item);
    }

    runCommand(command, item){
        const interpreter = new CommandInterpreter(command, this.actor, item);
        interpreter.run();
    }
}