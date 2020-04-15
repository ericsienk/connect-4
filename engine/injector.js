export const Injector = {
    map: {},
    service: function(service, name) {
        this.map[name] = service;
        return this;
    },
    get: function (name) {
        return this.map[name];
    }
}