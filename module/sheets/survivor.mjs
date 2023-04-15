import { CharacterSheet } from "../../dist/components.vue.js";
import { createApp } from "../lib/vue.esm-browser.js";

export class SurvivorSheet extends ActorSheet {

    constructor(...args) {
        super(...args);
    
        this.vueApp = null;
        this.vueRoot = null;
    }
    
    
    /** @override */
    get template() {
        return `systems/znz-vue/templates/survivor-sheet-vue.html`;
    }


    getData(){
        const context = super.getData();
        return context;
    }

    render(force=false, options={}) {
        const context = this.getData();

        if (!this.vueApp) {
            this.vueApp = createApp({
                data() {
                    return {
                        context: context,
                    }
                },
                components: {
                    'character-sheet': CharacterSheet
                },
                methods: {
                    updateContext(newContext) {
                        // We can't just replace the object outright without destroying the
                        // reactivity, so this instead updates the keys individually.
                        for (let key of Object.keys(this.context)) {
                            this.context[key] = newContext[key];
                        }
                    }
                }
            });
        } else { 
            // Pass new values from this.getData() into the app.
            this.vueRoot.updateContext(context);
            this.activateVueListeners($(this.form), true);
            return;
        }

        
        this._render(force, options).catch(err => {
            err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
            console.error(err);
            this._state = Application.RENDER_STATES.ERROR;
        }).then(rendered => { // Run Vue's render, assign it to our prop for tracking.
            this.vueRoot = this.vueApp.mount(`.znz-vue`);
            this.activateVueListeners($(this.form), false);
        });

        this.object.apps[this.appId] = this;
        return this;
    }

    async close(options={}) {
        this.vueApp.unmount();
        this.vueApp = null;
        this.vueRoot = null;
        return super.close(options);
    }

        /**
     * Apply drag events to items (powers and equipment).
     * @param {jQuery} html
     */
    _dragHandler(html) {
        let dragHandler = event => this._onDragStart(event);
        html.find('.item[data-draggable="true"]').each((i, li) => {
            li.setAttribute('draggable', true);
            li.addEventListener('dragstart', dragHandler, false);
        });
    }

    /**
     * Activate additional listeners on the rendered Vue app.
     * @param {jQuery} html
     * @param {boolean} repeat
     *   Used to require logic to execute only once.
     */
    activateVueListeners(html, repeat = false) {
        if (!this.options.editable) {
            html.find('input,select,textarea').attr('disabled', true);
            return;
        }

        this._dragHandler(html);

        // Place one-time executions after this line.
        if (repeat) return;

        html.find('.editor-content[data-edit]').each((i, div) => this._activateEditor(div));
    }

}