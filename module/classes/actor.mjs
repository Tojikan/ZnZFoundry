import { CharacterHelper } from "../helpers/actor-helpers.js";

/**
* Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
* @extends {Actor}
*/
export class ZnZActor extends Actor {
	
	/** @override */
	prepareData() {
		// Prepare data for the actor. Calling the super version of this executes
		// the following, in order: data reset (to clear active effects),
		// prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
		// prepareDerivedData().
		super.prepareData();
	}
	
	/** @override */
	prepareBaseData() {
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
	}
	
	/**
	* @override
	* Augment the basic actor data with additional dynamic data. Typically,
	* you'll want to handle most of your calculated/derived data in this step.
	* Data calculated in this step should generally not exist in template.json
	* (such as ability modifiers rather than ability scores) and should be
	* available both inside and outside of character sheets (such as if an actor
	* is queried and has a roll executed directly from it).
	*/
	prepareDerivedData() {
		const actorData = this;
		
		// Make separate methods for each Actor type (character, monster, etc.) to keep
		// things organized.
		this._prepareCharacterData(actorData);
	}
	
	/**
	 * Prepare Character type specific data
	*/
	_prepareCharacterData(actorData) {
		if (actorData.type !== 'character') return;

		actorData.calculated = {};
		// Make modifications to data here. For example:
		CharacterHelper.CalculateWeight(actorData);
		CharacterHelper.CalculateCost(actorData);
		CharacterHelper.CalculatePenalty(actorData);
		CharacterHelper.CalculateSlots(actorData);
	}
}
