import { Editor } from "el/editor/manager/Editor";
import { StrokeLineCap, StrokeLineJoin } from "el/editor/types/model";
import ObjectProperty from "el/editor/ui/property/ObjectProperty";
import ColorMatrixEditor from "./editor/ColorMatrixEditor";
import FuncFilterEditor from "./editor/FuncFilterEditor";
import SVGFilterEditor from "./SVGFilterEditor";
import SVGFilterPopup from "./SVGFilterPopup";
import SVGFilterSelectEditor from "./SVGFilterSelectEditor";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        ColorMatrixEditor,
        FuncFilterEditor,
        SVGFilterSelectEditor,
        SVGFilterEditor
    })


    editor.registerMenuItem('inspector.tab.style', {
        SVGItemProperty: ObjectProperty.create({
            title: editor.$i18n('svg.item.property.title'),
            editableProperty: 'svg-item',
        })
    })

    editor.registerMenuItem('popup', {
        SVGFilterPopup
    })

    editor.registerInspector('svg-item', current => {
        return [
            {
              key: 'edit',
              editor: 'Button',
              editorOptions: {
                text: 'Edit',
                action: ['open.editor', current]
              },
            },
            {
              key: 'fill',
              editor: 'FillSingleEditor',
              editorOptions: {
                label: editor.$i18n('svg.item.property.fill'),
              },
              defaultValue: current['fill']        
            },
            {
              key: 'fill-opacity',
              editor: 'number-range',
              editorOptions: {
                label: editor.$i18n('svg.item.property.fillOpacity'),
                min: 0,
                max: 1, 
                step: 0.01
              },
              defaultValue: current['fill-opacity']
            },
            {
              key: 'fill-rule',
              editor: 'ToggleCheckBox',
              editorOptions: {
                label: editor.$i18n('svg.item.property.fillRule'),
                toggleLabels: ["NONZERO","EVENODD" ],
                toggleValues: ["nonzero","evenodd" ]
              },
              defaultValue: current['fill-rule'] || "nonzero"
            },
            {
              key: 'stroke',
              editor: 'fill-single',
              editorOptions: {
                label: editor.$i18n('svg.item.property.stroke'),
              },
              defaultValue: current['stroke']        
            },
            {
              key: 'stroke-width',
              editor: 'range',
              editorOptions: {
                label: editor.$i18n('svg.item.property.strokeWidth'),
              },
              defaultValue: current['stroke-width']        
            },      
            {
              key: 'stroke-dasharray',
              editor: 'StrokeDashArrayEditor',
              editorOptions: {
                label: editor.$i18n('svg.item.property.dashArray'),
              },
              defaultValue: current['stroke-dasyarray'] || ""        
            },    
            {
              key: 'stroke-dashoffset',
              editor: 'number-range',
              editorOptions: {
                label: editor.$i18n('svg.item.property.dashOffset'),
                min: -1000,
                max: 1000,
                step: 1
              },
              defaultValue: current['stroke-dashoffset']        
            },
            {
              key: 'stroke-linecap',
              editor: 'ToggleCheckBox',
              editorOptions: {
                label: editor.$i18n('svg.item.property.lineCap'),
                toggleLabels: ["line_cap_butt","line_cap_round","line_cap_square" ],
                toggleValues: [StrokeLineCap.BUTT, StrokeLineJoin.ROUND, StrokeLineCap.SQUARE],
              },
              defaultValue: current['stroke-linecap'] || StrokeLineCap.BUTT
            },
            {
              key: 'stroke-linejoin',
              editor: 'ToggleCheckBox',
              editorOptions: {
                label: editor.$i18n('svg.item.property.lineJoin'),
                toggleLabels: ["line_join_miter", "line_join_round","line_join_bevel"],
                toggleValues: [StrokeLineJoin.MITER, StrokeLineJoin.ROUND, StrokeLineJoin.BEVEL]
              },
              defaultValue: current['stroke-linejoin'] || StrokeLineJoin.MITER
            },
            {
              key: 'mix-blend-mode',
              editor: 'BlendSelectEditor',
              editorOptions: {
                label: editor.$i18n('svg.item.property.blend'),
              },
              defaultValue: current['mix-blend-mode']
            },
          ]
    })

    editor.registerInspector('polygon', (item) => {
        return [
            {
                key: 'count',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Count',
                    min: 3,
                    max: 100,
                    step: 1
                }, 
                defaultValue: item.count
            },
            {
                key: 'button',
                editor: 'Button',
                editorOptions: {
                    label: 'Copy ',
                    text: 'as path',
                    action: "copy.path"
                }
            },

            {
                key: 'button2',
                editor: 'Button',
                editorOptions: {
                    label: 'Test Popup',
                    action: [
                        'showComponentPopup', 
                        {    
                            title: 'Sample Test Popup', 
                            width: 400,
                            inspector: [
                                { 
                                    key: 'test',
                                    editor: 'Button',
                                    editorOptions: {
                                        label: 'Test',
                                        text: 'text',
                                        onClick: () => {
                                            alert('yellow');
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    })

    editor.registerInspector('spline', (item) => {
        return [ 
            {
                key: 'boundary',
                editor: 'SelectIconEditor',
                editorOptions: {
                    label: 'Boundary',
                    options: ["clamped", "open", "closed" ]
                }
            },
            {
                key: 'button',
                editor: 'Button',
                editorOptions: {
                    label: 'Copy ',
                    text: 'as path',
                    action: "copy.path"
                }
            }
        ]
    })

    editor.registerInspector('star', (item) => {
        return [         
            {
                key: 'isCurve',
                editor: 'ToggleCheckBox',
                editorOptions: {
                    label: 'Curve',
                    // toggleLabels: ['Curve', 'Not Curve'],
                    defaultValue: item.isCurve,
                }
            },
            {
                key: 'count',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Count',
                    min: 1,
                    max: 100,
                    step: 1
                }
            },
            {
                key: 'radius',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Inner Radius',
                    min: -1,
                    max: 1,
                    step: 0.01
                }
            },
            {
                key: 'tension',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Tension',
                    min: 0,
                    max: 1,
                    step: 0.01
                }
            },
            {
                key: 'button',
                editor: 'Button',
                editorOptions: {
                    label: 'Copy ',
                    text: 'as path',
                    action: "copy.path"
                }
            }       

        ]
    })
}