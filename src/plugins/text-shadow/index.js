import { Editor } from "el/editor/manager/Editor";
import TextShadowProperty from "./TextShadowProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerUI('inspector.tab.style', {
        TextShadowProperty        
    })
}