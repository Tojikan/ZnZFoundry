import { ZnZActor } from "./classes/actor.mjs";
import { ZnZActorSheet } from "./classes/actor-sheet.mjs";

import { preloadHandlebarsTemplates } from "./templates.js";


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
	
	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	game.basicfantasyrpg = {
		ZnZActor
	};

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
		formula: "1d20 + @initBonus.value)",
		decimals: 0
	};

	// Define custom Document classes
	CONFIG.Actor.documentClass = ZnZActor;

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("worldbuilding", ZnZActorSheet, { makeDefault: true });






	/* -------------------------------------------- */
	/*  Handlebars Helpers                          */
	/* -------------------------------------------- */

	// If you need to add Handlebars helpers, here are a few useful examples:
	Handlebars.registerHelper('concat', function() {
		var outStr = '';
		for (var arg in arguments) {
		if (typeof arguments[arg] != 'object') {
			outStr += arguments[arg];
		}
		}
		return outStr;
	});
	
	Handlebars.registerHelper('toLowerCase', function(str) {
		return str.toLowerCase();
	});
	
	Handlebars.registerHelper('localizeLowerCase', function(str) {
		return game.i18n.localize(str).toLowerCase();
	});

	/**
	 * Slugify a string.
	 */
	Handlebars.registerHelper('slugify', function(value) {
		return value.slugify({strict: true});
	});


	// Preload template partials
	await preloadHandlebarsTemplates();
});