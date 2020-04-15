import { Injector } from "./injector.js";

const componentMap = {};

function getArgs(obj) {
    var args = (obj.toString().match(/constructor\s*?\(([^)]*)\)/) || ['', ''])[1];
    return args.split(',').map((arg) => arg.replace(/\/\*.*\*\//, '').trim()).filter(x => x);
}
  
function camelCase(attribute) {
    return attribute.nodeName.split('-')
        .map((name, i) => i ? (name[0].toUpperCase() + name.slice(1)) : name)
        .join('');
}

export class Engine {
    constructor(context, components = [], services = {}) {
        components.forEach(c => {
            componentMap[c.selector.toLowerCase()] = {
                template: c.template,
                constructor: c
            };
        });

        Object.keys(services).forEach(service => Injector.service(services[service], service))

        this.render(context);
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
                const services = getArgs(componentMap[nodeName].constructor).map((s) => Injector.get(s));
                newParentContext = new componentMap[nodeName].constructor(...services);
                newParentContext.init(e, attr);
            }
            self.render(e, newParent, newParentContext);
        });
    }
}
