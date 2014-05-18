window.Admin = Ember.Application.create();

Admin.ApplicationSerializer = DS.ActiveModelSerializer.extend(
  {
    primaryKey: '_id'
  }
);

Admin.ApplicationAdapter = DS.RESTAdapter.extend();