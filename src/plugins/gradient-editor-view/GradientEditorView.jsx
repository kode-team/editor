import {
  DOMDIFF,
  LEFT_BUTTON,
  LOAD,
  POINTERSTART,
  PREVENT,
  SUBSCRIBE,
} from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { END, MOVE } from "el/editor/types/event";
import "./GradientEditorView.scss";
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import {
  calculateAngleForVec3,
  calculateRotationOriginMat4,
  vertiesMap,
} from "el/utils/math";
import { Length } from "el/editor/unit/Length";
import { GradientType } from "el/editor/types/model";
import { vec3 } from "gl-matrix";

var radialTypeList = [
  "circle",
  "circle closest-side",
  "circle closest-corner",
  "circle farthest-side",
  "circle farthest-corner",
  "ellipse",
  "ellipse closest-side",
  "ellipse closest-corner",
  "ellipse farthest-side",
  "ellipse farthest-corner",
];

var repeatTypeList = [
  "no-repeat",
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
];

var circleGradientList = [
  GradientType.RADIAL,
  GradientType.REPEATING_RADIAL,
  GradientType.CONIC,
  GradientType.REPEATING_CONIC,
];

/**
 * Gradient Editor View
 *
 * 모든 좌표 계산은 matrix 를 기준으로 한다.
 *
 * current.createBackgroundImageMatrix(index) 를 통해서 matrix 를 생성한 값을 캐쉬로 잡고 처리한다.
 *
 * angle 을 어떻게 표현할지. 도구상에 어떻게 구성할지 고민해본다.
 *
 * matrix 로 표현된 영역전체의 drag 를 어떻게 할지 고민해본다.  (HtmlRenderView 와 유사한 로직으로 클릭후 이동에 대한 처리가 필요하다.)
 *
 * matrix 로 표현된 영역전체의 resize 를 어떻게 할지 고민해본다.  (selection tool 과 비슷한 것을 만들어야할수도 있다.)
 *
 */

export default class GradientEditorView extends EditorElement {
  initialize() {
    super.initialize();

    this.notEventRedefine = true;
  }

  template() {
    return <div class="elf--gradient-editor-view"></div>;
  }

  initializeData() {
    const value = this.$selection.current["background-image"];

    const cssValue = STRING_TO_CSS(value);

    this.state.backgroundImages = BackgroundImage.parseStyle(cssValue);
    this.state.backImages = BackgroundImage.parseStyle(cssValue);
    const current = this.$selection.current;
    this.state.gradient = this.state.backImages[this.state.index];
    this.state.maxWidth = current.screenWidth;
    this.state.maxHeight = current.screenHeight;
    this.state.backgroundImageMatrix = current.createBackgroundImageMatrix(
      this.state.index
    );
  }

  [POINTERSTART("$el .resizer") +
    LEFT_BUTTON +
    MOVE("calculateMovedResizer") +
    PREVENT](e) {
    this.state.$target = e.$dt;

    this.initializeData();
    this.initMousePoint = this.$viewport.getWorldPosition(e);
  }

  calculateMovedResizer(dx, dy) {
    const targetMousePoint = this.$viewport.getWorldPosition();

    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(this.initMousePoint);
    const nextVertex = targetMousePoint;

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    const reverseMatrix = this.$selection.current.absoluteMatrixInverse;
    const [currentResult, nextResult] = vertiesMap(
      [currentVertex, nextVertex],
      reverseMatrix
    );

    // 4. 복귀한 좌표에서 차이점을 구한다.
    const realDist = vec3.subtract([], nextResult, currentResult);
    const { backRect: rect } = this.state.backgroundImageMatrix;

    // width + dx, height + dy 를 적용한 recoverOffset 을 구한다.
    const backgroundImage = this.state.gradient;
    const backRect = backgroundImage.recoverOffset(
      rect.x,
      rect.y,
      this.state.maxWidth,
      this.state.maxHeight,
      realDist[0],
      realDist[1]
    );

    this.state.backgroundImages[this.state.index].reset({
      x: backRect.x,
      y: backRect.y,
      width: backRect.width,
      height: backRect.height,
    });

    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
  }

  [POINTERSTART("$el .back-rect") +
    LEFT_BUTTON +
    MOVE("calculateMovedRect") +
    END("calculateMovedEndRect") +
    PREVENT](e) {
    this.state.$target = e.$dt;

    this.initializeData();
    this.initMousePoint = this.$viewport.getWorldPosition(e);
  }

  calculateMovedRect(dx, dy) {
    const targetMousePoint = this.$viewport.getWorldPosition();

    // 1. 움직이는 vertex 를 구한다.
    const currentVertex = vec3.clone(this.initMousePoint);
    const nextVertex = targetMousePoint;

    // 3. invert matrix 를 실행해서  기본 좌표로 복귀한다.
    // var currentResult = vec3.transformMat4([], currentVertex, reverseMatrix);62849
    // var nextResult = vec3.transformMat4([], nextVertex, reverseMatrix);
    const reverseMatrix = this.$selection.current.absoluteMatrixInverse;
    const [currentResult, nextResult] = vertiesMap(
      [currentVertex, nextVertex],
      reverseMatrix
    );

    // 4. 복귀한 좌표에서 차이점을 구한다.
    const realDist = vec3.subtract([], nextResult, currentResult);
    const { backRect: rect } = this.state.backgroundImageMatrix;

    const backgroundImage = this.state.gradient;

    const backRect = backgroundImage.recoverOffset(
      rect.x + realDist[0],
      rect.y + realDist[1],
      this.state.maxWidth,
      this.state.maxHeight
    );

    this.state.backgroundImages[this.state.index].reset({
      x: backRect.x,
      y: backRect.y,
    });

    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
  }

  calculateMovedEndRect(dx, dy) {
    // 반복 타입 바꾸기
    if (dx == 0 && dy === 0) {
      const index = repeatTypeList.indexOf(this.state.gradient.repeat);

      this.state.backgroundImages[this.state.index].repeat =
        repeatTypeList[(index + 1) % repeatTypeList.length];

      var value = CSS_TO_STRING(
        BackgroundImage.toPropertyCSS(this.state.backgroundImages)
      );

      this.command(
        "setAttributeForMulti",
        "change background image",
        this.$selection.packByValue({
          "background-image": value,
        })
      );
    }
  }

  /**
   * 드래그 해서 객체 옮기기
   *
   * ctrl + pointerstart 하는  시점에 카피해보자.
   *
   * @param {PointerEvent} e
   */
  [POINTERSTART("$el .gradient-angle circle") +
    LEFT_BUTTON +
    MOVE("calculateMovedAngle") +
    END("calculatedMovedEndAngle") +
    PREVENT](e) {
    this.state.$target = e.$dt;
    this.initializeData();

    this.state.centerX = +this.state.$target.data("center-x");
    this.state.centerY = +this.state.$target.data("center-y");
    this.state.startX = +this.state.$target.attr("cx");
    this.state.startY = +this.state.$target.attr("cy");

    this.state.$target.toggleClass("moved");
  }

  calculateMovedAngle(dx, dy) {
    const center = [this.state.centerX, this.state.centerY, 0];
    const point = [this.state.startX, this.state.startY, 0];
    const dist = [dx, dy, 0];

    const distAngle = calculateAngleForVec3(point, center, dist);

    let newAngle = Math.floor(this.state.gradient.image.angle + distAngle)

    if (this.$config.get('bodyEvent').shiftKey) {
        newAngle -= newAngle % this.$config.get('fixed.angle');
    }

    this.state.backgroundImages[this.state.index].image.angle = newAngle;

    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
  }

  calculatedMovedEndAngle() {
    this.state.$target.toggleClass("moved");
  }

  /**
   * 드래그 해서 객체 옮기기
   *
   * ctrl + pointerstart 하는  시점에 카피해보자.
   *
   * @param {PointerEvent} e
   */
  [POINTERSTART("$el .gradient-position") +
    LEFT_BUTTON +
    MOVE("calculateMovedElement") +
    END("calculateMovedEndElement") +
    PREVENT](e) {
    this.state.$target = e.$dt;
    this.state.left = Length.parse(e.$dt.css("left")).value;
    this.state.top = Length.parse(e.$dt.css("top")).value;

    this.initializeData();
  }

  calculateMovedElement(dx, dy) {
    const newLeft = this.state.left + dx;
    const newTop = this.state.top + dy;

    this.state.$target.css({
      left: Length.px(newLeft),
      top: Length.px(newTop),
    });

    // 위치 바꾸기
    // screen 좌표를 worldPosition 으로 바꾸기
    const worldPosition = this.$viewport.applyVertexInverse([
      newLeft,
      newTop,
      0,
    ]);

    // local position 으로 바꾸기
    const localPosition = vertiesMap(
      [worldPosition],
      this.$selection.current.absoluteMatrixInverse
    )[0];

    const backgroundImage = this.state.gradient;

    const backRect = backgroundImage.getOffset(
      this.state.maxWidth,
      this.state.maxHeight
    );

    const newX = localPosition[0] - backRect.x;
    const newY = localPosition[1] - backRect.y;

    this.state.backgroundImages[this.state.index].image.radialPosition = [
      Length.percent((newX / backRect.width) * 100),
      Length.percent((newY / backRect.height) * 100),
    ];

    var value = CSS_TO_STRING(
      BackgroundImage.toPropertyCSS(this.state.backgroundImages)
    );

    this.command(
      "setAttributeForMulti",
      "change background image",
      this.$selection.packByValue({
        "background-image": value,
      })
    );
  }

  calculateMovedEndElement(dx, dy) {
    if (dx == 0 && dy === 0) {
      switch (this.state.gradient.type) {
        case GradientType.RADIAL:
        case GradientType.REPEATING_RADIAL:
          const index = radialTypeList.indexOf(
            this.state.gradient.image.radialType
          );

          this.state.gradient.image.radialType =
            radialTypeList[(index + 1) % radialTypeList.length];

          var value = CSS_TO_STRING(
            BackgroundImage.toPropertyCSS(this.state.backgroundImages)
          );

          this.command(
            "setAttributeForMulti",
            "change background image",
            this.$selection.packByValue({
              "background-image": value,
            })
          );

          break;
      }
    }
  }

  refresh() {
    if (this.state.isShow) {
      this.load();
    }
  }

  [SUBSCRIBE("updateViewport")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshSelectionStyleView")]() {
    if (this.$selection.current) {
      if (
        this.$selection.hasChangedField(
          "x",
          "y",
          "width",
          "height",
          "rotate",
          "background-image"
        )
      ) {
        this.refresh();
      }
    }
  }

  [SUBSCRIBE("showGradientEditorView")]({ index }) {
    this.state.index = index;

    this.$el.show();
    this.state.isShow = true;

    this.refresh();
    this.emit("recoverCursor");
  }

  [SUBSCRIBE("hideGradientEditorView")]() {
    this.$el.hide();
    this.state.isShow = false;
  }

  [SUBSCRIBE("refreshSelection")]() {
    this.refresh();
  }

  makeGradientRect(result) {
    const boxPosition = this.$viewport.applyVerties(result.backVerties);

    return (
      <>
        <div class="gradient-rect">
          <svg>
            <path
              class="back-rect"
              d={`
                    M ${boxPosition[0][0]} ${boxPosition[0][1]}
                    L ${boxPosition[1][0]} ${boxPosition[1][1]}
                    L ${boxPosition[2][0]} ${boxPosition[2][1]}
                    L ${boxPosition[3][0]} ${boxPosition[3][1]}
                    Z
                `}
            />
          </svg>
        </div>
        <div
          class="resizer"
          data-direction="bottom-right"
          style={{
            left: Length.px(boxPosition[2][0]),
            top: Length.px(boxPosition[2][1]),
          }}
        ></div>
      </>
    );
  }

  makeCenterPoint(result) {
    const { image } = result.backgroundImage;

    let centerPosition, centerStick;

    if (
      image.type === GradientType.LINEAR ||
      image.type === GradientType.REPEATING_LINEAR
    ) {
        const boxPosition = this.$viewport.applyVerties(result.backVerties);

        centerPosition = vec3.lerp([], boxPosition[0], boxPosition[2], 0.5);

        const stickPoint = vec3.lerp([], boxPosition[0], boxPosition[1], 0.5);

        centerStick = vec3.lerp([],
            centerPosition,
            vec3.lerp([], centerPosition, stickPoint, 1/vec3.dist(centerPosition, stickPoint)), 
            40
        ) ;

    } else {
      centerPosition = this.$viewport.applyVertex(
        result.radialCenterPosition
      );

      centerStick = vec3.lerp(
        [],
        centerPosition,
        this.$viewport.applyVertex(result.radialCenterStick),
        40
      );

    }
    const newCenterStick = vertiesMap( [centerStick], calculateRotationOriginMat4(image.angle, centerPosition))[0];    

    const targetStick = vec3.lerp([], newCenterStick, centerPosition, 3/4);

    return (
      <>
        <div
          class="gradient-position center"
          data-radial-type={image.radialType}
          style={{
            left: Length.px(centerPosition[0]),
            top: Length.px(centerPosition[1]),
          }}
        ></div>

        {image.type === GradientType.CONIC ||
        image.type === GradientType.REPEATING_CONIC ||
        image.type === GradientType.LINEAR ||
        image.type === GradientType.REPEATING_LINEAR ? (
          <svg class="gradient-angle">
            <path
              d={`
                        M ${targetStick[0]} ${targetStick[1]}
                        L ${newCenterStick[0]} ${newCenterStick[1]}
                    `}
            />
            <circle
              cx={newCenterStick[0]}
              cy={newCenterStick[1]}
              r="7"
              data-center-x={centerPosition[0]}
              data-center-y={centerPosition[1]}
            />
          </svg>
        ) : null}
      </>
    );
  }

  [LOAD("$el") + DOMDIFF]() {
    const current = this.$selection.current;

    if (!current) return "";

    const result = current.createBackgroundImageMatrix(this.state.index);

    return (
      <div>
        {this.makeGradientRect(result)}
        {this.makeCenterPoint(result)}
      </div>
    );
  }
}