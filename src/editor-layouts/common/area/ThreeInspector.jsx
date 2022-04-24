import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { BIND, createElement } from "sapa";
import { Tabs } from "elf/editor/ui/view/Tabs";
import { TabPanel } from "elf/editor/ui/view/TabPanel";
import { DesignMode } from "elf/editor/types/editor";

export default class ThreeInspector extends EditorElement {
  afterRender() {
    this.$el.toggle(this.$config.is("editor.design.mode", DesignMode.DESIGN));
  }

  [BIND("$el")]() {
    return {
      style: {
        display: this.$config.is("editor.design.mode", DesignMode.DESIGN)
          ? "block"
          : "none",
      },
    };
  }

  template() {
    return (
      <div class="feature-control inspector">
        <div>
          <Tabs
            ref="$tab"
            selectedValue="style"
            onchange={(value) => {
              this.$config.set("inspector.selectedValue", value);
            }}
          >
            <TabPanel
              value="style"
              title={this.$i18n("inspector.tab.title.design")}
            >
              <div style="display: flex; flex-direction: column;">
                {this.$injectManager.generate("inspector.tab.style")}
                <div class="empty" style="order: 1000000;"></div>
              </div>
            </TabPanel>

            {this.$injectManager.getTargetUI("inspector.tab").map((it) => {
              const { value, title, loadElements } = it.class;

              return (
                <TabPanel value={value} title={title} icon={it.icon}>
                  <div style="display: flex: flex-direction: column;">
                    {loadElements.map((element) => createElement(element))}
                    {this.$injectManager.generate("inspector.tab." + it.value)}
                    <div class="empty" style="order: 1000000;"></div>
                  </div>
                </TabPanel>
              );
            })}
          </Tabs>
        </div>
      </div>
    );
  }
}
