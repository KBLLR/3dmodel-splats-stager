/**
 * @file Provides a GUI for controlling Three.js material properties using Tweakpane.
 * @module MaterialGUI
 */

import { Pane } from 'tweakpane';

/**
 * @class MaterialGUI
 * @description Creates a Tweakpane GUI to interactively adjust the properties of a Three.js material.
 */
export class MaterialGUI {
    /**
     * @constructor
     * @description Initializes a new Tweakpane instance.
     */
    constructor() {
        /**
         * @property {Pane} pane - The Tweakpane instance for the GUI.
         */
        this.pane = new Pane();
    }

    /**
     * @method addMaterialControls
     * @description Adds a set of controls for a given material to the GUI.
     * @param {THREE.Material} material - The Three.js material to control.
     * @param {string} [name='Material'] - The name for the GUI folder.
     * @returns {import('tweakpane').FolderApi} The Tweakpane folder containing the controls.
     */
    addMaterialControls(material, name = 'Material') {
        const folder = this.pane.addFolder({ title: name });

        // Basic properties
        folder.addInput(material, 'color', { label: 'Color' });
        folder.addInput(material, 'opacity', { min: 0, max: 1 });
        folder.addInput(material, 'transparent');
        folder.addInput(material, 'flatShading');
        folder.addInput(material, 'depthWrite');
        folder.addInput(material, 'depthTest');

        // Physical properties
        if (material.isMeshPhysicalMaterial) {
            folder.addInput(material, 'metalness', { min: 0, max: 1 });
            folder.addInput(material, 'roughness', { min: 0, max: 1 });
            folder.addInput(material, 'clearcoat', { min: 0, max: 1 });
            folder.addInput(material, 'clearcoatRoughness', { min: 0, max: 1 });
            folder.addInput(material, 'transmission', { min: 0, max: 1 });
            folder.addInput(material, 'ior', { min: 1, max: 2.333 });
            folder.addInput(material, 'thickness', { min: 0, max: 5 });
        }

        // Environment mapping
        if (material.envMap) {
            folder.addInput(material, 'envMapIntensity', { min: 0, max: 4 });
        }

        return folder;
    }

    /**
     * @method dispose
     * @description Disposes of the Tweakpane GUI to free up resources.
     */
    dispose() {
        this.pane.dispose();
    }
}
