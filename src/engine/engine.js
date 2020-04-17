import { Injector } from "./injector.js";

const componentMap = {};
  
function camelCase(attribute) {
    return attribute.nodeName.split('-')
        .map((name, i) => i ? (name[0].toUpperCase() + name.slice(1)) : name)
        .join('');
}

export class Engine {
    constructor(context, components = [], services = {}) {
        this.components = [];
        components.forEach(c => {
            componentMap[c.selector.toLowerCase()] = {
                template: c.template,
                services: c.services || [],
                constructor: c
            };
        });

        Object.keys(services).forEach(service => Injector.service(services[service], service))

        this.render(context);
    }

    isComponent(selector) {
        return Boolean(componentMap[selector.toLowerCase()]);
    }

    destroy() {
        this.components.forEach(c => c.destroy());
        console.log('Engine destroyed!');
    }

    render(context, parent = null, parentContext = null) {
        const self = this;

        const nodes = ((context || { childNodes: [] }).childNodes || []);
        Array.from(nodes).forEach(e => {
            let newParent = parent;
            let newParentContext = parentContext;

            const nodeName = e.nodeName.toLowerCase();
            if (componentMap[nodeName]) {
                newParent = nodeName;

                let attr = {};
                if (parentContext) {
                    Array.from(e.attributes).forEach(a => {
                        const name = camelCase(a);
                        attr[name] = parentContext.evalBinding.apply(parentContext, [a.value]);
                    });
                }

                if (parent) {
                    e.setAttribute("parent", parent);
                }

                e.innerHTML = componentMap[nodeName].template;
                const services = componentMap[nodeName].services.map((s) => Injector.get(s));
                const component = new componentMap[nodeName].constructor(...services);
                this.components.push(component);
                newParentContext = component;
                newParentContext.init(e, attr);
            }
            self.render(e, newParent, newParentContext);
        });
    }
}
