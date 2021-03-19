import { znz } from './js/config.js';
import ZnZItemSheet from './module/sheets/ZnZItemSheet.js';



Hooks.once("init", function(){

    CONFIG.znz = znz;

    // Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("znz", ZnZItemSheet, {makeDefault: true});
});