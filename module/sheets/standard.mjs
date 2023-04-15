export class StandardSheet extends ActorSheet {
    constructor(...args) {
        super(...args);
    }

        /** @override */
        get template() {
            return `systems/znz-vue/templates/standard.html`;
        }
    
}