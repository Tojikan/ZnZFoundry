


export default class ZnZActor extends Actor {

    /**@override */
    prepareData(){
        //prepare actor data
        //does not typically need to be overrided.
        //Calling the super version executes in order - data reset, prepareBaseData(), prepareEmbeddedDocuments(), prepareDerivedData()
        super.prepareData();
    }

    
//#region Prepare Character Data
    /**@override */
    //Prepare any data related to the Document itself before any embedded Documents or derived data is computed
    //Typically blank but may be useful sometimes.
    prepareBaseData(){
    
    }
    /**@override */
    //Augments base data with additional data that you calculate or derive. Such as determining ability modifiers.
    prepareDerivedData(){
        const actorData = this.data; //so we can type less. 
        const data = actorData.data; //foundry stores system vars in data and custom properties in data.data  - the data is doubled up because you can access unmodified data in data._source and modified in data.data
        const flags = actorData.flags.znz || {}; //flags allow you to store arbitrary data on existing documents. useful for user input

        this._prepareCharacterData(actorData);
        this._prepareZombieData(actorData);
    }
    _prepareCharacterData(actorData){
        if (actorData.type !== 'character') return;

        const data = actorData.data;

        //set modifier
        for (let attr of data.attributes){
            attr.mod = Math.floor((attr.value) / 2);
        }
    }

    _prepareZombieData(actorData){
        //make modifications to data here
        if (actorData.type !== 'zombie') return;
    }

//#endregion



//#region Prepare Roll Data
    /**@override */
    //Overrides the getRollData() thats supplied to rolls Foundry chat / custom rolls
    getRollData() {
        const data = super.getRollData();

        this._getCharacterRollData(data);
        this._getZombieRollData(data);

        return data;
    }

    _getCharacterRollData(data) {
        if (this.data.type !== 'character') return;
    }

    _getZombieRollData(data) {
        if (this.data.type !== 'zombie') return;
    }


//#endregion


//#region Helpers


//#endregion

}