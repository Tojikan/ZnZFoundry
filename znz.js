import ZnZItemSheet from './module/sheets/ZnZItemSheet.js';



Hooks.once("init", function(){
    // Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("znz", ZnZItemSheet, {makeDefault: true});
});