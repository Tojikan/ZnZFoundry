<script lang="ts" setup>
import CharacterSheet from "./components/CharacterSheet.vue"
import { ref } from "vue";



const mockContext = ref({
    "cssClass": "editable",
    "editable": true,
    "document": {
        "name": "Test123",
        "type": "survivor",
        "img": "icons/svg/mystery-man.svg",
        "system": {
            "health": {
                "min": 0,
                "value": 123,
                "max": 1234
            },
            "fatigue": {
                "min": 0,
                "value": 10,
                "max": 99999
            },
            "weight": {
                "value": 0
            },
            "xp": {
                "value": 0
            },
            "attributes": {
                "str": {
                    "value": 10
                },
                "agi": {
                    "value": 10
                },
                "con": {
                    "value": 10
                },
                "int": {
                    "value": 10
                },
                "per": {
                    "value": 10
                },
                "cha": {
                    "value": 10
                },
                "luck": {
                    "value": 10
                }
            }
        },
        "prototypeToken": {
            "name": "Test123",
            "displayName": 0,
            "actorLink": false,
            "texture": {
                "src": "icons/svg/mystery-man.svg",
                "scaleX": 1,
                "scaleY": 1,
                "offsetX": 0,
                "offsetY": 0,
                "rotation": 0,
                "tint": null
            },
            "width": 1,
            "height": 1,
            "lockRotation": false,
            "rotation": 0,
            "alpha": 1,
            "disposition": -1,
            "displayBars": 0,
            "bar1": {
                "attribute": "health"
            },
            "bar2": {
                "attribute": "fatigue"
            },
            "light": {
                "alpha": 0.5,
                "angle": 360,
                "bright": 0,
                "color": null,
                "coloration": 1,
                "dim": 0,
                "attenuation": 0.5,
                "luminosity": 0.5,
                "saturation": 0,
                "contrast": 0,
                "shadows": 0,
                "animation": {
                    "type": null,
                    "speed": 5,
                    "intensity": 5,
                    "reverse": false
                },
                "darkness": {
                    "min": 0,
                    "max": 1
                }
            },
            "sight": {
                "enabled": false,
                "range": null,
                "angle": 360,
                "visionMode": "basic",
                "color": null,
                "attenuation": 0.1,
                "brightness": 0,
                "saturation": 0,
                "contrast": 0
            },
            "detectionModes": [],
            "flags": {},
            "randomImg": false
        },
        "items": [],
        "effects": [],
        "folder": null,
        "sort": 0,
        "ownership": {
            "default": 0,
            "WDcjvEzl11uUUql7": 3
        },
        "flags": {
            "core": {
                "sheetClass": "znz-vue.SurvivorSheet"
            }
        },
        "_stats": {
            "systemId": "znz-vue",
            "systemVersion": "1.0.0",
            "coreVersion": "10.291",
            "createdTime": 1679455681519,
            "modifiedTime": 1679456619400,
            "lastModifiedBy": "WDcjvEzl11uUUql7"
        },
        "_id": "cOlZpubEZz3hXw2o"
    },
    "data": {
        "_id": "cOlZpubEZz3hXw2o",
        "name": "Test123",
        "type": "survivor",
        "img": "icons/svg/mystery-man.svg",
        "system": {
            "health": {
                "min": 0,
                "value": 123,
                "max": 1234
            },
            "fatigue": {
                "min": 0,
                "value": 10,
                "max": 99999
            },
            "weight": {
                "value": 0
            },
            "xp": {
                "value": 0
            },
            "attributes": {
                "str": {
                    "value": 10
                },
                "agi": {
                    "value": 10
                },
                "con": {
                    "value": 10
                },
                "int": {
                    "value": 10
                },
                "per": {
                    "value": 10
                },
                "cha": {
                    "value": 10
                },
                "luck": {
                    "value": 10
                }
            }
        },
        "prototypeToken": {
            "name": "Test123",
            "displayName": 0,
            "actorLink": false,
            "texture": {
                "src": "icons/svg/mystery-man.svg",
                "scaleX": 1,
                "scaleY": 1,
                "offsetX": 0,
                "offsetY": 0,
                "rotation": 0,
                "tint": null
            },
            "width": 1,
            "height": 1,
            "lockRotation": false,
            "rotation": 0,
            "alpha": 1,
            "disposition": -1,
            "displayBars": 0,
            "bar1": {
                "attribute": "health"
            },
            "bar2": {
                "attribute": "fatigue"
            },
            "light": {
                "alpha": 0.5,
                "angle": 360,
                "bright": 0,
                "color": null,
                "coloration": 1,
                "dim": 0,
                "attenuation": 0.5,
                "luminosity": 0.5,
                "saturation": 0,
                "contrast": 0,
                "shadows": 0,
                "animation": {
                    "type": null,
                    "speed": 5,
                    "intensity": 5,
                    "reverse": false
                },
                "darkness": {
                    "min": 0,
                    "max": 1
                }
            },
            "sight": {
                "enabled": false,
                "range": null,
                "angle": 360,
                "visionMode": "basic",
                "color": null,
                "attenuation": 0.1,
                "brightness": 0,
                "saturation": 0,
                "contrast": 0
            },
            "detectionModes": [],
            "flags": {},
            "randomImg": false
        },
        "items": [],
        "effects": [],
        "folder": null,
        "sort": 0,
        "ownership": {
            "default": 0,
            "WDcjvEzl11uUUql7": 3
        },
        "flags": {
            "core": {
                "sheetClass": "znz-vue.SurvivorSheet"
            }
        },
        "_stats": {
            "systemId": "znz-vue",
            "systemVersion": "1.0.0",
            "coreVersion": "10.291",
            "createdTime": 1679455681519,
            "modifiedTime": 1679456619400,
            "lastModifiedBy": "WDcjvEzl11uUUql7"
        }
    },
    "limited": false,
    "options": {
        "baseApplication": "ActorSheet",
        "width": 800,
        "height": 720,
        "top": null,
        "left": null,
        "scale": null,
        "popOut": true,
        "minimizable": true,
        "resizable": true,
        "id": "",
        "classes": [
            "sheet"
        ],
        "dragDrop": [
            {
                "dragSelector": ".item-list .item",
                "dropSelector": null,
                "permissions": {},
                "callbacks": {}
            }
        ],
        "tabs": [],
        "filters": [],
        "title": "",
        "template": "templates/sheets/actor-sheet.html",
        "scrollY": [],
        "closeOnSubmit": false,
        "editable": true,
        "sheetConfig": true,
        "submitOnChange": true,
        "submitOnClose": true,
        "viewPermission": 1,
        "secrets": [
            {
                "parentSelector": ".editor",
                "callbacks": {}
            }
        ],
        "token": null
    },
    "owner": true,
    "title": "Test123",
    "actor": {
        "name": "Test123",
        "type": "survivor",
        "img": "icons/svg/mystery-man.svg",
        "system": {
            "health": {
                "min": 0,
                "value": 123,
                "max": 1234
            },
            "fatigue": {
                "min": 0,
                "value": 10,
                "max": 99999
            },
            "weight": {
                "value": 0
            },
            "xp": {
                "value": 0
            },
            "attributes": {
                "str": {
                    "value": 10
                },
                "agi": {
                    "value": 10
                },
                "con": {
                    "value": 10
                },
                "int": {
                    "value": 10
                },
                "per": {
                    "value": 10
                },
                "cha": {
                    "value": 10
                },
                "luck": {
                    "value": 10
                }
            }
        },
        "prototypeToken": {
            "name": "Test123",
            "displayName": 0,
            "actorLink": false,
            "texture": {
                "src": "icons/svg/mystery-man.svg",
                "scaleX": 1,
                "scaleY": 1,
                "offsetX": 0,
                "offsetY": 0,
                "rotation": 0,
                "tint": null
            },
            "width": 1,
            "height": 1,
            "lockRotation": false,
            "rotation": 0,
            "alpha": 1,
            "disposition": -1,
            "displayBars": 0,
            "bar1": {
                "attribute": "health"
            },
            "bar2": {
                "attribute": "fatigue"
            },
            "light": {
                "alpha": 0.5,
                "angle": 360,
                "bright": 0,
                "color": null,
                "coloration": 1,
                "dim": 0,
                "attenuation": 0.5,
                "luminosity": 0.5,
                "saturation": 0,
                "contrast": 0,
                "shadows": 0,
                "animation": {
                    "type": null,
                    "speed": 5,
                    "intensity": 5,
                    "reverse": false
                },
                "darkness": {
                    "min": 0,
                    "max": 1
                }
            },
            "sight": {
                "enabled": false,
                "range": null,
                "angle": 360,
                "visionMode": "basic",
                "color": null,
                "attenuation": 0.1,
                "brightness": 0,
                "saturation": 0,
                "contrast": 0
            },
            "detectionModes": [],
            "flags": {},
            "randomImg": false
        },
        "items": [],
        "effects": [],
        "folder": null,
        "sort": 0,
        "ownership": {
            "default": 0,
            "WDcjvEzl11uUUql7": 3
        },
        "flags": {
            "core": {
                "sheetClass": "znz-vue.SurvivorSheet"
            }
        },
        "_stats": {
            "systemId": "znz-vue",
            "systemVersion": "1.0.0",
            "coreVersion": "10.291",
            "createdTime": 1679455681519,
            "modifiedTime": 1679456619400,
            "lastModifiedBy": "WDcjvEzl11uUUql7"
        },
        "_id": "cOlZpubEZz3hXw2o"
    },
    "items": [],
    "effects": []
});

</script>



<template>
  <CharacterSheet :context="mockContext" :actor="mockContext.actor"/>
</template>

