import {
  CLICK,
  IF,
  POINTERSTART,
  SUBSCRIBE,
  LOAD,
  BIND,
  DOMDIFF,
  SUBSCRIBE_SELF,
} from "sapa";
import { EditorElement } from "../common/EditorElement";

import "./DropdownMenu.scss";
import { isFunction, isNotUndefined } from "sapa";
import { initializeGroupVariables, variable } from "sapa";
import { iconUse } from "elf/editor/icon/icon";
import { Dom } from "sapa";
import { Length } from "elf/editor/unit/Length";
import { createComponent } from "sapa";
import { isArray } from "sapa";
import { isString } from "sapa";

function makeMenuItem(it) {
  if (it === "-") {
    return createComponent("Divider");
  }

  if (it === "-" || it.type === "divider") {
    return createComponent("DropdownDividerMenuItem");
  }

  if (isString(it)) {
    return createComponent("DropdownTextMenuItem", {
      text: it,
    });
  }

  if (it.type === "link") {
    return createComponent("DropdownLinkMenuItem", {
      href: it.href,
      target: it.target,
      title: it.title,
    });
  }

  if (isArray(it.items)) {
    return createComponent("DropdownMenuList", {
      title: it.title,
      items: it.items,
    });
  }

  return createComponent("DropdownMenuItem", {
    checked: it.checked,
    command: it.command,
    args: it.args || [],
    disabled: it.disabled,
    icon: it.icon,
    nextTick: it.nextTick,
    onClick: it.onClick,
    action: it.action,
    shortcut: it.shortcut,
    title: it.title,
    key: it.key,
    events: it.events,
    items: it.items || [],
  });
}

function Divider(props) {
  return /*html*/ `<li class="dropdown-divider" data-key="${props.key}"></li>`;
}

class DropdownDividerMenuItem extends EditorElement {
  template() {
    return /*html*/ `<li class="dropdown-divider"></li>`;
  }
}

class DropdownTextMenuItem extends EditorElement {
  template() {
    return /*html*/ `<li class='text'><label>${this.$i18n(
      this.props.text
    )}</label></li>`;
  }
}

class DropdownLinkMenuItem extends EditorElement {
  template() {
    return /*html*/ `<li><a href="${this.props.href}" target="${
      this.props.target || "_blank"
    }">${this.$i18n(this.props.title)}</a></li>`;
  }
}

class DropdownMenuList extends EditorElement {
  components() {
    return {
      Divider,
      DropdownDividerMenuItem,
      DropdownLinkMenuItem,
      DropdownMenuList,
      DropdownMenuItem,
    };
  }

  template() {
    return /*html*/ `
      <li>
          <label>${this.$i18n(this.props.title)}</label> 
          <span>${iconUse("arrowRight")}</span>              
          <ul>
              ${this.props.items.map((child) => makeMenuItem(child)).join("")}
          </ul>
      </li>
    `;
  }
}

class DropdownMenuItem extends EditorElement {
  initialize() {
    super.initialize();

    const events = this.props.events || [];
    if (events.length) {
      events.forEach((event) => {
        this.on(event, () => this.refresh());
      });
    }
  }

  template() {
    const it = this.props;

    const checked = isFunction(it.checked) ? it.checked(this.$editor) : "";
    return /*html*/ `
        <li data-command="${it.command}" data-has-children="${Boolean(
      it.items?.length
    )}"
          ${it.disabled && "disabled"} 
          ${it.shortcut && "shortcut"}
          ${checked && "checked"}
          ${
            it.nextTick &&
            `data-next-tick=${variable(it.nextTick, this.groupId)}`
          } 
          ${it.args && `data-args=${variable(it.args, this.groupId)}`} 
          ${it.key && `data-key=${it.key}`} 
        >
            <span class="icon">${
              checked ? iconUse("check") : it.icon || ""
            }</span>
            <div class='menu-item-text'>
              <label>${this.$i18n(it.title)}</label>
              <kbd class="shortcut">${it.shortcut || ""}</kbd>
            </div>
        </li>
      `;
  }

  [CLICK("$el")]() {
    if (this.props.command) {
      this.emit(this.props.command, ...(this.props.args || []));
    } else if (isFunction(this.props.action)) {
      this.props.action(this.$editor, this);
    } else if (isFunction(this.props.onClick)) {
      this.props.action(this.$editor, this);
    }
  }
}

export class DropdownMenu extends EditorElement {
  components() {
    return {
      Divider,
      DropdownDividerMenuItem,
      DropdownLinkMenuItem,
      DropdownTextMenuItem,
      DropdownMenuList,
      DropdownMenuItem,
    };
  }

  initialize() {
    super.initialize();

    const events = this.props.events || [];
    if (events.length) {
      events.forEach((event) => {
        this.on(event, () => this.refresh());
      });
    }
  }

  initState() {
    return {
      direction: this.props.direction || "left",
      opened: this.props.opened || false,
      items: this.props.items || [],
      selectedKey: this.props.selectedKey,
      dy: this.props.dy || 0,
    };
  }

  template() {
    const { direction, opened } = this.state;

    const openedClass = opened ? "opened" : "";
    return /*html*/ `
        <div class="dropdown-menu ${openedClass}" data-direction="${direction}">
          <span class='icon' ref="$icon"></span>
          <span class='label' ref='$label'></span>
          <span class='dropdown-arrow' ref="$arrow">${iconUse(
            "keyboard_arrow_down"
          )}</span>
          <ul class="dropdown-menu-item-list" ref="$list"></ul>
          <div class="dropdown-menu-arrow">
              <svg viewBox="0 0 12 6" width="12" height="6">
                <path d="M0,6 L6,0 L12,6 "></path>
              </svg>
          </div>
      </div>
      `;
  }

  [LOAD("$icon")]() {
    return isFunction(this.props.icon)
      ? this.props.icon(this.state)
      : this.props.icon;
  }

  [BIND("$label")]() {
    return {
      innerHTML: this.props.title,
    };
  }

  [BIND("$el")]() {
    const selected = isFunction(this.props.selected)
      ? this.props.selected(this.state, this.$editor)
      : false;
    return {
      "data-selected": selected,
      style: {
        ...(this.props.style || {}),
        "--elf--dropdown-menu-width": this.props.width,
        "--elf--dropdown-menu-dy": isNotUndefined(this.props.dy)
          ? Length.px(this.props.dy)
          : 0,
      },
    };
  }

  close() {
    this.setState(
      {
        opened: false,
      },
      false
    );
    this.$el.removeClass("opened");
  }

  toggle() {
    this.setState(
      {
        opened: !this.state.opened,
      },
      false
    );
    this.$el.toggleClass("opened", this.state.opened);

    if (this.state.opened) {
      this.emit("hideDropdownMenu");
    }
  }

  get groupId() {
    return this.id + "$list";
  }

  [LOAD("$list") + DOMDIFF]() {
    initializeGroupVariables(this.groupId);
    return this.state.items.map((it) => makeMenuItem(it));
  }

  checkDropdownOpen(e) {
    const ul = Dom.create(e.target).closest("dropdown-menu-item-list");

    if (!ul) return true;

    return false;
  }

  [CLICK("$arrow") + IF("checkDropdownOpen")]() {
    this.toggle();
  }

  [CLICK("$label") + IF("checkDropdownOpen")]() {
    this.toggle();
  }

  [CLICK("$icon")]() {
    if (this.state.selectedKey) {
      const menuItem = this.state.items.find(
        (it) => it.key === this.state.selectedKey
      );

      if (!menuItem) return;

      const command = menuItem.command;
      const args = menuItem.args;
      const nextTick = menuItem.nextTick;
      const key = menuItem.key;

      // command 를 실행하고
      if (command) {
        this.emit(command, ...args);
      }

      // nextTick 은 액션처럼 실행하고
      if (nextTick && isFunction(nextTick)) {
        this.nextTick(nextTick);
      }

      this.setState({
        selectedKey: key,
      });

      // 닫고
      this.close();
    } else {
      this.toggle();
    }
  }

  [CLICK("$el [data-command]")](e) {
    const command = e.$dt.data("command");
    const args = e.$dt.data("args") || [];
    const nextTick = e.$dt.data("next-tick");
    const key = e.$dt.data("key");

    // command 를 실행하고
    if (command) {
      this.emit(command, ...args);
    }

    // nextTick 은 액션처럼 실행하고
    if (nextTick && isFunction(nextTick)) {
      this.nextTick(nextTick);
    }

    this.setState({
      selectedKey: key,
    });

    // 닫고
    this.close();
  }

  [SUBSCRIBE_SELF("updateMenuItems")](items) {
    this.setState({ items });
  }

  [SUBSCRIBE("hideDropdownMenu")]() {
    this.close();
  }

  [POINTERSTART("document")](e) {
    const $target = Dom.create(e.target);

    const $dropdown = $target.closest("dropdown-menu");

    if (!$dropdown) {
      this.close();
    } else if ($dropdown.el !== this.$el.el) {
      this.close();
    }
  }
}
