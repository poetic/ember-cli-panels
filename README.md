# ember-cli-panels

Disclaimer: This is a WIP undergoing heavy development. Breaking changes may be ahead.

## Tip

Make sure to have a meta tag like this in your app if you want to prevent
zooming and weird scrolling issues.

```html
<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
```

## Installation

`npm install ember-cli-panels --save-dev`

## Getting Started

This package exposes a `ps-panel` component that wraps dynamically created `ps-pane` components.

The `ps-panel` is defined in your template like so:

```javascript
// app/templates/index.hbs

{{ps-panel
  draggable=true
  currentPaneName=pane
  paneControllers=paneControllers
  showAnimation=showAnimation
  hideAnimation=hideAnimation
}}
```

Where `currentPaneName` is a pane you would like to initially present when rendering the template, `paneControllers` is a list of controllers that are associated with each pane, and `showAnimation`, `hideAnimation`, are [liquid-fire](https://github.com/ef4/liquid-fire) animations that handle the transitions.

`ps-panel` components are of two kinds, static and draggable. Draggable allows for horizontal swipe-to-navigate functionality between panes, and static (by removing `draggable=true`) will allow for immediate pane switching based on links or actions.

There is some setup required in the controller for the template. Specifically, a `pane` query param needs to be registered and initialized with the pane that is shown on rendering. This is the `pane` property passed into the `ps-pane` above.

Optionally, in the controller for this template you can extend from `PanelController`.

```javascript
// app/controllers/index.js

import PanelController from 'ember-cli-panels/controllers/panel';
import initPaneControllers from 'ember-cli-panels/utils/init-pane-controllers';

export default PanelController.extend({
    // define this property to declare the initially rendered pane
  pane: 'panes/main-nav/upcoming',

    // order here reflects left/right order of panes in template
  paneControllers: initPaneControllers([
    'panes/main-nav/rsvp', 'panes/main-nav/upcoming', 'panes/main-nav/past-events'
  ]),
});
```

This will set up the `pane` query parameter and provide default `showAnimation` and `hideAnimation` functions. These can be overridden if need be by importing the `animate` function from liquid-fire.

A pane is defined by a file in the `templates/` folder and a matching file in the `controllers/` folder. So the above pane property will look for a template in `app/templates/panes/main-nav/upcoming` and a controller in `app/controllers/panes/main-nav/upcoming`.

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
