/**
 * Functionality involving Items
 */
export class ItemWrapper {
    constructor(item){
        this.item = item;
        this.weaponType = item.type;
        this.result = {
            success: true
        };

        //Determine which resources to consume on item
        this.useType = {
            ATK: "attack",
            DEF: "defend",
            USE: "use",
            CON: "consume"
        }
    }

    testSpendResources(type){
        return this.spendResources(type, false);
    }


    spendResources(type, doSpend = true){
        switch (type){
            case this.useType.ATK:
                if (this.isRanged()){
                    this.spendAmmo(doSpend);
                }
                this.spendDurability(type, doSpend);
                break;

            case this.useType.DEF:
                this.spendDurability(type, doSpend);
                break;

            case this.useType.USE:
                break;

            case this.useType.CON:
                break;

            default:
                console.error("Invalid item usage type!");
                ui.notifications.error("Error: Unknown item usage type!");
                this.result.success = false;
                break;
        }

        return this.result;
    }


    spendAmmo(doSpend){
        if ("fail" in this.result || !("ammo" in this.item.system)){
            return false;
        }

        let ammo = this.item.system.ammo.current;
        if (ammo == 0){
            ui.notifications.error(game.i18n.localize("ZNZRPG.noAmmoYouText"));
            this.sendMessage(game.i18n.localize("ZNZRPG.noAmmoText"));

            this.result.success = false;
            this.result.fail = "ammo";
            return false;
        }


        if (doSpend){
            let newAmmo = Math.max(0, ammo - 1);
            this.item.update({"system.ammo.current": newAmmo});
        }
        return true;
    }

    spendDurability(type, doSpend){
        if ("fail" in this.result || !("durability" in this.item.system)){
            return false;
        }

        let durability = this.item.system.durability.value;
        if (durability <= 0){
            ui.notifications.error(game.i18n.localize("ZNZRPG.noDurabilityYouText"));
            this.sendMessage(game.i18n.localize("ZNZRPG.noDurabilityText"));
            
            this.result.success = false;
            this.result.fail = "durability";
            return false;
        }

        if (doSpend){
            let durabilityCost = this.getDurabilityCost(type);
            let newDurability = Math.max(0, durability - durabilityCost);
            this.item.update({"system.durability.value": newDurability});
        }

        return true;
    }

    sendMessage(msg){
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.item.actor }),
            content: `<div style='color:red; background-color:#ffd7b5'>${msg}</div>`,
        });
    }

    getDurabilityCost(type){
        if (type == this.useType.ATK && "durabilityPerAttack" in this.item.system ){
            return this.item.system.durabilityPerAttack.value;
        }

        if (type == this.useType.DEF && "durabilityPerBlock" in this.item.system ){
            return this.item.system.durabilityPerBlock.value;
        }

        if ("durabilityPerUse" in this.item.system){
            return this.item.system.durabilityPerUse.value;
        }

        return 10; //fallback
    }

    snapshotResources(){
        let durability = this.item.system.durability.value ?? null;
        let ammo = this.item.system.ammo.current ?? null;
        let uses = this.item.system.uses.value ?? null;

        this.snapshot = {
            durability: durability,
            ammo: ammo,
            uses: uses
        };
    }

    unspendResources(){
        if (!this.snapshot){
            return;
        }

        let update = {};

        if ("durability" in this.snapshot && this.snapshot.durability != null){
            update["system.durability.value"] = Math.min(this.snapshot.durability, 100);
        }

        if ("ammo" in this.snapshot && this.snapshot.ammo != null){
            let ammoMax = this.item.system.ammo.max;
            update["system.ammo.current"] = Math.max(Math.min(this.snapshot.ammo, ammoMax), 0);
        }

        if ("uses" in this.snapshot && this.snapshot.uses != null){
            update["system.uses.value"] = Math.max(this.snapshot.uses, 0);
        }

        this.item.update(update);
    
    }


    isRanged(){
        return this.weaponType == "ranged_weapon";
    }

    isMelee(){
        return this.weaponType == "melee_weapon";
    }

    getUsedAttrAndSkill(usageType){
        if (usageType == this.useType.DEF){
            return {
                attr: "end",
                skill: "defend",
                multi: "block"
            }

        }
        else if (usageType == this.useType.ATK && this.isRanged()){
            return {
                attr: "dex",
                skill: "ranged",
                multi: "damage"
            }
        } else if (usageType == this.useType.ATK && this.isMelee()){
            return {
                attr: "str",
                skill: "melee",
                multi: "damage"
            }
        }
        
        throw("Unknown weapon combination!");
    }

    getRollName(usageType){
        if (usageType == this.useType.DEF){
            return `Defend with ${this.item.name}`;
        } else if (usageType == this.useType.ATK){
            return `Attack with ${this.item.name}`;
        } else {
            return `Use ${this.item.name}`;
        }
    }
}