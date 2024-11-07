import { Pane } from 'tweakpane';

export class MaterialGUI {
    constructor() {
        this.pane = new Pane();
    }

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

    dispose() {
        this.pane.dispose();
    }
}
