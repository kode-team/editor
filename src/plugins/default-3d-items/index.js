// import { Editor } from "elf/editor/manager/Editor";
import { Project } from "./layers/Project";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerItem("project", Project);
}
