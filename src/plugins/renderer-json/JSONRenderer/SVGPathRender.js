import SVGItemRender from "./SVGItemRender";

export default class SVGPathRender extends SVGItemRender {
  async toCloneObject(item, renderer) {
    return {
      ...(await super.toCloneObject(item, renderer)),
      ...item.attrs("d"),
    };
  }
}
