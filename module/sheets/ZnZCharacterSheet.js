export default class ZnZCharacterSheet extends ActorSheet{
    
    
    /**@override */
    //Every sheet needs to define default options
    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            classes: ["znz", "sheet", "actor"], // classes applied to character sheet
            template: "systems/znz/templates/sheets/character-sheet.html", //must be relative to foundry's root. can use get template() to retrieve name dynamically
            width: 600,
            height: 600
            //tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }] //define tabs on your sheet
          });
    }

    get template() {
        return "systems/znz/templates/sheets/character-sheet.html";
    }


    /**@override */
    //Allows you to derive new data for the sheet, similar to prepareData(). However data created here is only available to this class and to the HTML template but NOT  on the character.
    getData(){
        //get data structure from the base sheet
        const context = super.getData(); //so we don't have to use data.data. Also this uses a built-in toObject() to get a deep clone, avoiding hard-to-debug issues in the original object

        //actors data
        const actorData = context.actor.data

        //add actor's data and flags for easier access
        context.data = actorData.data;
        context.flags = actorData.flags;

        if (actorData.type == 'character'){
            this._prepareItems(context);
        }


        return context;

    }

    _prepareItems(context){
        const inventory = [];
        const equipped = [];

        //Assign and return
        context.inventory = inventory;
        context.equipped = equipped;
    }
}