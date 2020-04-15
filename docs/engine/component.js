export class Component {
    context;
    attr;
    watchers = [];
    constructor(onInit) {
        this.onInit = onInit;
    }

    init(context, attr) {
        this.context = context;
        this.attr = attr;
        this.onInit();
        setTimeout(() => {
            this.registerWatches(context);
            setInterval(() => this.watchers.forEach(w => w.call()), 20);
        }, 0);
    }

    onClick(selector, callback) {
        const elements = this.context === selector ? this.context : this.context.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.addEventListener('click', (event) => {
                callback.apply(this, [event, element, index]);
            });
        });
    }

    setInput(selector, value) {
        this.context.querySelector(selector).value = value;
    }

    getInput(selector) {
        return this.context.querySelector(selector).value;
    }

    setClass(selector, className, enable) {
        const element = this.context.querySelector(selector);
        if (enable) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }

    evalBinding(binding) {
        return eval(binding);
    }

    watch(e, matches, scope) {
        const watcher = { e, matches, scope };

        watcher.call = () => {
            const val = (this.evalBinding.apply(watcher.scope, [(matches[2])]));
            if (watcher.oldVal !== val) {
                watcher.e.textContent = matches[1] + val + matches[3];
            }
            watcher.oldVal = val;
        };


        this.watchers.push(watcher);
    }

    searchTextNodes(context, self) {
        Array.from(context.childNodes || []).forEach(n => {
            const e = n;
            if (e.getAttribute && e.getAttribute('parent') === this.context.nodeName) {
                return;
            }

            if (e.nodeType === 3 && e.nodeValue.trim()) {
                const matches = /(.*){{(.+)}}(.*)/g.exec(e.nodeValue);
                if (matches) {
                    this.watch(e, matches, self);
                }
            }

            this.searchTextNodes(e, self);
        });
    }

    registerWatches(context) {
        const self = this;
        Array.from(context.childNodes || []).forEach(n => {
            const e = n;
            if (self.context && e.getAttribute && e.getAttribute('parent') !== self.context.nodeName) {
                this.searchTextNodes(e, self);
                this.registerWatches(e);
            }
        });
    }
}