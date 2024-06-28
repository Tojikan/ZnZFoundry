export function manageToggleEffect(event, owner){
    event.preventDefault();
    const $toggle = $(event.currentTarget);

    const effectName = $toggle.data("effect");

    for (let effect of owner.effects){
        if (effect.label === effectName){
            effect.update({disabled: !effect.disabled});
            return;
        }
    }

    //create if not already existing
    owner.createEmbeddedDocuments("ActiveEffect", [{
        label: effectName,
        icon: "icons/svg/aura.svg",
        origin: owner.uuid,
        disabled: false
    }]);
}



/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning document which manages this effect
 */
export function onManageActiveEffect(event, owner) {
    event.preventDefault();
    const a = event.currentTarget;
    const li = a.closest("li");
    const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
    switch ( a.dataset.action ) {
      case "create":
        return owner.createEmbeddedDocuments("ActiveEffect", [{
          label: "New Effect",
          icon: "icons/svg/aura.svg",
          origin: owner.uuid,
          "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
          disabled: li.dataset.effectType === "inactive"
        }]);
      case "edit":
        return effect.sheet.render(true);
      case "delete":
        return effect.delete();
      case "toggle":
        return effect.update({disabled: !effect.data.disabled});
    }
}