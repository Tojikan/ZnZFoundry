import ZnZActor from './module/actor/ZnZActor.js';
import ZnZCharacterSheet from './module/sheets/ZnZCharacterSheet.js';
import ZnZWeaponSheet from './module/sheets/ZnZWeaponSheet.js';



Hooks.once("init", function(){

    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
    game.znz = {
        ZnZActor,
    };

    
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("znz", ZnZWeaponSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("znz", ZnZCharacterSheet, {makeDefault: true});
});
