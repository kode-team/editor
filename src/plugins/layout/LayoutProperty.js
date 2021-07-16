
import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF} from "el/base/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class LayoutProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('layout.property.title');
  }

  getLayoutOptions () {
    return ['default', 'flex', 'grid'].map(it => {
        return `${it}:${this.$i18n(`layout.property.${it}`)}`
    }).join(',');
  }

  getClassName() {
    return 'layout-property';
  }

  getBody() {
    return /*html*/`
        <div class='property-item' ref='$layoutType'></div>
      `;
  }  

  [LOAD('$layoutType')] () {
    var current = this.$selection.current || { layout : 'default' }
    return /*html*/`
      <div class='layout-select'>
        <object refClass="SelectIconEditor" 
          ref='$layout' 
          key='layout' 
          icon="true" 
          value="${current.layout}"
          options="${this.getLayoutOptions()}"  
          colors=",green,red"
          onchange="changeLayoutType" />
      </div>
      <div class='layout-list' ref='$layoutList'>
        <div data-value='default' class='${current.layout === 'default' ? 'selected': ''}'></div>
        <div data-value='flex' class='${current.layout === 'flex' ? 'selected': ''}'>
          <object refClass="FlexLayoutEditor" ref='$flex' key='flex-layout' value="${current['flex-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
        <div data-value='grid' class='${current.layout === 'grid' ? 'selected': ''}'>
          <object refClass="GridLayoutEditor" ref='$grid' key='grid-layout' value="${current['grid-layout'] || ''}" onchange='changeLayoutInfo' />
        </div>
      </div>
    `
  }

  [SUBSCRIBE_SELF('changeLayoutInfo')] (key, value) {
    this.command('setAttributeForMulti', 'change layout info', this.$selection.packByValue({ 
      [key]: value
    }))

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize');    
    })

  }

  [SUBSCRIBE_SELF('changeLayoutType')] (key, value) {

    this.$selection.reset({
      [key]: value 
    })

    this.command('setAttributeForMulti', 'change layout type', this.$selection.packByValue({ 
      [key]: value
    }))

    this.refresh();

    this.nextTick(() => {
      this.emit('refreshAllElementBoundSize');
      this.emit('changeItemLayout')
    })

  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refreshShow(['rect', 'circle', 'artboard'], true);
  }
}