import { DEBOUNCE, IF, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "sapa";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import { createComponent } from "sapa";

export default class BorderRadiusProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("border.radius.property.title");
  }

  getBody() {
    return /*html*/ `<div class="property-item full border-radius-item" ref='$body'></div>`;
  }

  [LOAD("$body")]() {
    var current = this.$selection.current || {};
    var value = current["border-radius"] || "";

    return createComponent("BorderRadiusEditor", {
      ref: "$1",
      value,
      onchange: "changeBorderRadius",
    });
  }

  get editableProperty() {
    return "border-radius";
  }

  [SUBSCRIBE("refreshSelection") + DEBOUNCE(100) + IF("checkShow")]() {
    this.refresh();
  }

  [SUBSCRIBE_SELF("changeBorderRadius")](value) {
    this.command(
      "setAttributeForMulti",
      "change border radius",
      this.$selection.packByValue({
        "border-radius": value,
      })
    );
  }
}
