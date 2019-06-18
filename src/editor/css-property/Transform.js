import {
  UNIT_DEG,
  UNIT_PERCENT,
  UNIT_COLOR,
  UNIT_PX
} from "../../util/css/types";
import { Length } from "../unit/Length";
import { Property } from "../items/Property";

const TRANSFORM_REG = /((matrix|translate(X|Y|Z|3d)?|scale(X|Y|Z|3d)?|rotate(X|Y|Z|3d)?|skew(X|Y)|matrix(3d)?|perspective)\(([^\)]*)\))/gi;

export class Transform extends Property {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({ itemType: "transform", ...obj });
  }

  toString() {
    return `${this.json.type}(${this.json.value.join(', ') || ""})`;
  }

  hasNumberValue () {
    var type = this.json.type; 
    return type.includes('matrix') || type.includes('scale')
  }

  static parse (transform) {
    return new Transform(transform);
  }

  static parseStyle (transform) {

    var transforms = [];

    if (!transform) return transforms;

    var matches = (transform.match(TRANSFORM_REG) || []);
    matches.forEach((value, index) => {
      var [transformName, transformValue] = value.split("(");
      transformValue = transformValue.split(")")[0];

      var arr = transformValue.split(',');

      if (transformValue.includes('matrix') || transformValue.includes('scale')) {
        arr = arr.map(it => Length.number(it.trim()))
      } else {
        arr = arr.map(it => Length.parse(it.trim()))
      }

      // drop shadow 제외한 나머지 값 지정
      transforms[index] = Transform.parse({
        type: transformName,
        value: arr
      });

    });
    return transforms;
  }

}