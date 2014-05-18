Admin.Router.map(function() {
  this.resource('elements', function() {
    this.resource('element', { path: ':element_id' });
  });
});

// ... additional lines truncated for brevity ...
Admin.ElementsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('element');
  }
});

Admin.ElementRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('element', params.element_id);
  }
});

Admin.ElementController = Ember.ObjectController.extend({
  actions: {
    save: function() {
      this.get('model').save();
    },
    delete: function() {
      this.get('model').destroyRecord();
    }
  }
});

Admin.ElementsController = Ember.ArrayController.extend({
  actions: {
    add: function() {
      var title = this.get('newTitle');
      if (!title.trim()) {
        return;
      }
      var element = this.store.createRecord('element', {
        title: title,
        visible: false
      });
      var self = this;
      function transitionToElement(element) {
        self.set('newTitle','');
        self.transitionToRoute('element', element);
      }
      element.save().then(transitionToElement);

    },
  }
});