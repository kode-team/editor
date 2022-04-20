import { DRAGOVER, DROP, PREVENT, SUBSCRIBE } from "el/sapa/Event";

import BaseLayout from "../common/BaseLayout"; 
import BodyPanel from "../common/BodyPanel";
import PopupManager from "../common/PopupManager";
import KeyboardManager from "../common/KeyboardManager";


import designEditorPlugins from "plugins/design-editor-plugins";
import { isFunction } from 'el/sapa/functions/func';
import IconManager from '../common/IconManager';
import { createComponent } from "el/sapa/functions/jsx";

import './layout.scss';

/**
 * whiteboard system 
 * 
 * todo 
 * 
 * 1. menu system 
 * 2. attribute property 
 * 
 */
export default class WhiteBoard extends BaseLayout {

  initialize() {
    super.initialize();

    this.$pathkit.load();

    // load default data 
    this.emit('load.json', this.opt.data);
  }

  components() {
    return {
      BodyPanel,
      PopupManager,
      KeyboardManager,
      IconManager,
    }
  }

  /**
   * 
   * @protected
   * @returns {function[]}
   */
  getPlugins() {
    return designEditorPlugins
  }

  template() {
    return /*html*/`
      <div class="elf-studio whiteboard">
        <div class="layout-main">
          <div class="layout-middle" ref='$middle'>      
            <div class="layout-body" ref='$bodyPanel'>
              ${createComponent('BodyPanel', {ref: "$bodyPanelView"})}
            </div>                           
          </div>
          ${createComponent("KeyboardManager")}
        </div>
        ${createComponent("PopupManager")}
        ${createComponent("IconManager")}
      </div>
    `;
  }

  afterRender() {
    super.afterRender();

    this.$config.init('editor.layout.elements', this.refs);    

  }

  /** 드랍존 설정을 위해서 남겨놔야함 */
  [DRAGOVER('$middle') + PREVENT] (e) {}
  [DROP('$middle') + PREVENT] (e) {}
  /** 드랍존 설정을 위해서 남겨놔야함 */  

  [SUBSCRIBE('toggle.fullscreen')] () {
    this.$el.toggleFullscreen();
  }

  [SUBSCRIBE('getLayoutElement')] (callback) {
    if (isFunction(callback)) {
      callback(this.refs);
    }
  }
}