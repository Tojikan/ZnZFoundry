import { ZnZActor } from "./classes/actor.mjs";
import { ZnZActorSheet } from "./classes/actor-sheet.mjs";

import { preloadHandlebarsTemplates } from "./helpers/hbsTemplates.js";
import { ZnZItem } from "./classes/item.mjs";
import { ZnZItemSheet } from "./classes/item-sheet.mjs";
import { NumberOrZero } from "./helpers/common.js";

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

	
	Handlebars.registerHelper('numberOrZero', NumberOrZero);
	
	Handlebars.registerHelper('toLowerCase', function(str) {
		return str.toLowerCase();
	});

	Handlebars.registerHelper('toUpperCase', function(str) {
		return str.toUpperCase();
	});
	
	Handlebars.registerHelper('localizeLowerCase', function(str) {
		return game.i18n.localize(str).toLowerCase();
	});

	Handlebars.registerHelper('capitalize', function(str) {
		if (!str || !str.length){
			return str;
		}
		return str.charAt(0).toUpperCase() + str.substring(1);
	});

	Handlebars.registerHelper('unslugify', function(str) {
		return str.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
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
	

	/**
	 * Switch case 
	 * https://stackoverflow.com/questions/53398408/switch-case-with-default-in-handlebars-js
	 */
	Handlebars.registerHelper('switch', function(value, options) {
		this.switch_value = value;
		return options.fn(this);
	  });
	  
	  Handlebars.registerHelper('case', function(value, options) {
		if (value == this.switch_value) {
		  return options.fn(this);
		}
	  });
	  
	  Handlebars.registerHelper('default', function(value, options) {
		  return true; ///We can add condition if needs
	  });
	  

	// Preload template partials
	await preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Other Hook                                   */
/* -------------------------------------------- */

Hooks.on("preCreateItem", (itemData) => {
	if (itemData.type === 'melee_weapon'){
		itemData.updateSource({img:"icons/svg/sword.svg"});
		console.log(itemData);
	} else if (itemData.type === 'ranged_weapon'){
		itemData.updateSource({img:"systems/znz4e/icons/handgun.svg"});
	} else if (itemData.type === 'wearable'){
		itemData.updateSource({img:"icons/svg/shield.svg"});
	} else if (itemData.type === 'skill'){
		itemData.updateSource({img:"icons/svg/book.svg"});
	} else if (itemData.type === 'ability'){
		itemData.updateSource({img:"icons/svg/aura.svg"});
	} else if (itemData.type === 'flaw'){
		itemData.updateSource({img:"icons/svg/skull.svg"});
	}
});