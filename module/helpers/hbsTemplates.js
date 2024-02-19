/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

    // Define template paths to load
    const templatePaths = [
      "systems/znz4e/templates/actor/actor-sheet.html",
      "systems/znz4e/templates/actor/parts/actor-combat.html",
      "systems/znz4e/templates/actor/parts/actor-inventory.html",
      "systems/znz4e/templates/actor/parts/actor-abilities.html",
      "systems/znz4e/templates/actor/parts/actor-settings.html",
      "systems/znz4e/templates/actor/components/item-cards/smallcards.html"
    ];
  
    // Load the template parts
    return loadTemplates(templatePaths);
  };