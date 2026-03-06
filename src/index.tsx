import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { ILauncher } from "@jupyterlab/launcher";
import { Widget } from "@lumino/widgets";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import "../style/index.css";

/**
 * Extension ID 
 */
const EXTENSION_ID = "assignment-hub-jupyterlab";

/**
 * Create the Assignment Hub widget
 */
function createWidget(): Widget {
  const widget = new Widget();
  widget.id = "assignment-hub-widget";
  widget.title.label = "Assignment Hub";
  widget.title.closable = true;


  widget.addClass("assignments-ui-widget");

  /* Ensure widget fills JupyterLab main area */
  widget.node.style.width = "100%";
  widget.node.style.height = "100%";

  ReactDOM.render(<App />, widget.node);

  return widget;
}

/**
 * JupyterLab plugin definition
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,

  requires: [ILauncher],

  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher
  ) => {

    const command = "assignment-hub:open";

    
    let widget: Widget | null = null;

    app.commands.addCommand(command, {
      label: "Assignment Hub",
      execute: () => {
        if (!widget || widget.isDisposed) {
          widget = createWidget();
          app.shell.add(widget, "main");
        }

        app.shell.activateById(widget.id);
      }
    });

    /* Launcher tile */
    launcher.add({
      command,
      category: "Other",
      rank: 1
    });
  }
};


export default plugin;
