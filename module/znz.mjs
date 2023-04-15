
import { SurvivorSheet } from "./sheets/survivor.mjs"
import { StandardSheet } from "./sheets/standard.mjs"


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("znz-vue", SurvivorSheet, { label: 'Survivor', makeDefault: true });
    Actors.registerSheet("znz-vue", StandardSheet, { label: 'test', makeDefault: false });
    // Items.unregisterSheet("core", ItemSheet);

});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
    
});