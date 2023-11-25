import { ZnZActor } from "./classes/actor.mjs";
import { ZnZActorSheet } from "./classes/actor-sheet.mjs";

import { preloadHandlebarsTemplates } from "./templates.js";
import { ZnZItem } from "./classes/item.mjs";
import { ZnZItemSheet } from "./classes/item-sheet.mjs";


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
	
	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	game.znz4e = {
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
	CONFIG.Item.documentClass = ZnZItem;

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("znz4e", ZnZActorSheet, { makeDefault: true });
	Items.unregisterSheet("core", ItemSheet);
  	Items.registerSheet("znz4e", ZnZItemSheet, { makeDefault: true });



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

	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

		switch (operator) {
			case '==':
				return (v1 == v2) ? options.fn(this) : options.inverse(this);
			case '===':
				return (v1 === v2) ? options.fn(this) : options.inverse(this);
			case '!=':
				return (v1 != v2) ? options.fn(this) : options.inverse(this);
			case '!==':
				return (v1 !== v2) ? options.fn(this) : options.inverse(this);
			case '<':
				return (v1 < v2) ? options.fn(this) : options.inverse(this);
			case '<=':
				return (v1 <= v2) ? options.fn(this) : options.inverse(this);
			case '>':
				return (v1 > v2) ? options.fn(this) : options.inverse(this);
			case '>=':
				return (v1 >= v2) ? options.fn(this) : options.inverse(this);
			case '&&':
				return (v1 && v2) ? options.fn(this) : options.inverse(this);
			case '||':
				return (v1 || v2) ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper('toLowerCase', function(str) {
		return str.toLowerCase();
	});
	
	Handlebars.registerHelper('localizeLowerCase', function(str) {
		return game.i18n.localize(str).toLowerCase();
	});

	Handlebars.registerHelper('capitalize', function(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	});

	/**
	 * Slugify a string.
	 */
	Handlebars.registerHelper('slugify', function(value) {
		return value.slugify({strict: true});
	});

	Handlebars.registerHelper('json', function(context) {
		return JSON.stringify(context);
	});


	// Preload template partials
	await preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Other Hook                                   */
/* -------------------------------------------- */

Hooks.on("preCreateItem", (itemData) => {
	if (itemData.type === 'weapon'){
		itemData.updateSource({img:"icons/svg/sword.svg"});
	} else if (itemData.type === 'armor'){
		itemData.updateSource({img:"icons/svg/shield.svg"});
	} else if (itemData.type === 'skill'){
		itemData.updateSource({img:"icons/svg/book.svg"});
	} else if (itemData.type === 'ability'){
		itemData.updateSource({img:"icons/svg/aura.svg"});
	}
});