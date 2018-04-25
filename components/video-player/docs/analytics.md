## Analytics

Events like play/pause, changing the speed or the subtitle language are tracked. The `AnalyticsManager` handles collecting all necessary data and firing JavaScript events containing the tracked data. It offers two methods for firing events which are called in the component where the action occurs. For the components the `AnalyticsManager` is available through dependency injection (defined in `video-player` component). It holds a reference to the top level `VideoPlayer` component and the `StateManager`. Thus, it is also possible to track state changes during an action and include before/after states in the event.

**Events** consist of
* a *verb* identifying the kind of action that happened. Verbs are set as constants `ANALYTICS_TOPICS.*` in `constants.html` and are specified as follows:
    ```JS
    ANALYTICS_TOPICS = {
        VERB_NAME = 'verb_name',
    };
    ```
    `VERB_NAME` is the constant that is used in all components. `verb_name` is the actual name of the verb in the fired event.
* a set of *basic data* which is collected for every event, e.g. curreent position, volume, ...
* a set of *event specific data* only needed or appliccable for particular events

### Firing Events
Normally firing an event is handled right where it occures: in the particular component. There are two exceptions from that: Closing a tab and changing the screen orientation is directly tracked and handled by the `AnalyticsManager` as there is no relation to any other component.

To fire an event in a component you need to load the `constants` module, the `ANALYTICS_TOPICS` constants and the `AnalyticsManager` itself as follows for a component named `ExampleComponent`:
```HTML
<script>
    // Include AnalyticsManager and constants
    define(['binding-helpers', 'ioc-provider', 'ioc-requester', 'analytics-manager', 'constants'], (BindingHelpersMixin, IocProviderMixin, IocRequesterMixin, AnalyticsManager, constants) => {
      // Load necessary constants
      const {ANALYTICS_TOPICS} = constants;

      class ExampleComponent extends BindingHelpersMixin(IocRequesterMixin(IocProviderMixin(Polymer.Element))) {
        static get is() { return 'example-component'; }

        static get properties() {
          return {
            // load AnalyticsManager
            _analyticsManager: {
              type: Object,
              inject: 'AnalyticsManager',
            },
          }
        }
      }

      window.customElements.define(ExampleComponent.is, ExampleComponent);
    });
</script>
```

There are two ways of firing events:
* a **simple event** only containing some given data
    ```JS
    this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VERB_NAME}, states);
    ```
    `VERB_NAME` is the name of your event. `states` is an object of the data you want to send
* **doing and tracking a state change** of a `StateManager` property, capturing data before and after the state change:
    ```JS
    this._analyticsManager.changeState(changeFunction, changeParameters, {verb: ANALYTICS_TOPICS.VERB_NAME})
    ```
    `changeFunction` is the `StateManager`'s method as string. `changeParameters` is an array of the appropriate parameters for that method. `VERB_NAME` is the same as for simple events.

    The data to be tracked before and after the state change is defined in the `changeState` method of the `AnalyticsManager` itself depending on `verb`'s value:
    ```JS
    // In AnalyticsManager.changeState(changeFunction, changeParameters, options)

    let beforeStates = {};
    switch (options.verb) {
      // Track data before state change
      case ANALYTICS_TOPICS.VERB_NAME:
        beforeStates.oldMyProperty = this.stateManager.state.property;
        beforeStates.oldMyData = this._getMyData();
        break;
    }

    // Do state change
    this.stateManager[changeFunction](...changeParameters);

    let afterStates = {};
    switch (options.verb) {
      // Track data after state change
      case ANALYTICS_TOPICS.VERB_NAME:
        afterStates.newMyProperty = this.stateManager.state.property;
        afterStates.newMyData = this._getMyData();
        break;
    }
    ```
