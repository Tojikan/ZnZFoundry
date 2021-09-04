export default class ZnZItemSheet extends ItemSheet{
    get template(){
        return `systems/znz/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();

        data.config = CONFIG.znz;

        return data;
    }
}