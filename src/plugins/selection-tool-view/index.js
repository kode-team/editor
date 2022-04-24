// import { Editor } from "elf/editor/manager/Editor";
import SelectionToolView from "./SelectionToolView";
import GroupSelectionToolView from "./GroupSelectionToolView";
import GhostToolView from "./GhostToolView";
import { CanvasViewToolLevel } from "elf/editor/types/editor";

/**
 *
 * @param {Editor} editor
 */
export default async function (editor) {
  editor.registerUI(
    "canvas.view",
    {
      GhostToolView,
      SelectionToolView,
      GroupSelectionToolView,
    },
    CanvasViewToolLevel.SELECTION_TOOL
  );
}
