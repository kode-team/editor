import {
  BIND,
  CLICK,
  LOAD,
  SUBSCRIBE_SELF,
  isFunction,
  createComponent,
  isBoolean,
} from "sapa";

import "./layout.scss";
import dataEditorPlugins from "./plugins/data-editor-plugins";

import { BaseLayout } from "apps/common/BaseLayout";
import { IconManager } from "apps/common/IconManager";
import { KeyboardManager } from "apps/common/KeyboardManager";
import { PopupManager } from "apps/common/PopupManager";
import { Editor } from "elf/editor/manager/Editor";

/**
 * Editor 가 가지고 있는 기본 몇가지 매니저를 재구성 해야할 듯
 *
 * * ShortcutManager
 * * CommandManager
 *
 */

export class DataEditor extends BaseLayout {
  components() {
    return {
      PopupManager,
      KeyboardManager,
      IconManager,
    };
  }

  /**
   *
   * @protected
   * @returns {function[]}
   */
  getPlugins() {
    return dataEditorPlugins;
  }

  createEditorInstance() {
    return new Editor({
      ignoreManagers: ["ShortCutManager"],
    });
  }

  afterRender() {
    super.afterRender();

    this.$config.init("editor.layout.elements", this.refs);
  }

  initState() {
    return {
      inspector: this.props.inspector || [],
      onChange: this.props.onChange || (() => true),
      open:
        isBoolean(this.props.open) && this.props.open === false ? false : true,
      leftSize: 340,
      rightSize: 280,
      bottomSize: 0,
      lastBottomSize: 150,
    };
  }

  template() {
    return /*html*/ `
      <div class="elf-studio dataeditor" ref="$bodyPanel">
        <div class="layout-main" ref="$main">
            <div class='control-view' ref="$body"></div>
            <div class='close' ref="$close">Close Controls</div>        
        </div>

        ${createComponent("KeyboardManager")}        
        ${createComponent("PopupManager")}
        ${createComponent("IconManager")}
      </div>
    `;
  }

  [CLICK("$close")]() {
    this.setState(
      {
        open: !this.state.open,
      },
      false
    );

    this.bindData("$main");
    this.bindData("$close");
  }

  [BIND("$main")]() {
    return {
      "data-open-status": this.state.open,
    };
  }

  [BIND("$close")]() {
    return {
      text: this.state.open ? "Close Controls" : "Open Controls",
    };
  }

  [LOAD("$body")]() {
    const inspector = this.state.inspector;

    return createComponent("ComponentEditor", {
      ref: "$comp",
      inspector,
      onchange: "changeComponent",
    });
  }

  getValue() {
    return this.children.$comp.getValue();
  }

  [SUBSCRIBE_SELF("changeComponent")](key, value) {
    if (isFunction(this.state.onChange)) {
      this.emit(this.state.onChange, this, key, value);
    }
  }
}
