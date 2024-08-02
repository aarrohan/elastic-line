function init() {
  document
    .querySelectorAll(`[data-component="elastic-line"]`)
    .forEach((component) => {
      component.innerHTML = `
    <svg width="${component.getAttribute(
      "data-width"
    )}" height="300" viewbox="0 0 400 300">
      <path
        class="elastic-line-component-curve"
        d="M10,150 Q200,150 ${
          Number(component.getAttribute("data-width")) - 10
        },150"
        fill="none"
        stroke="${component.getAttribute("data-color")}"
        stroke-width="${component.getAttribute("data-size")}"
      />
    </svg>
    `;

      let svgElement, path;
      let connected, tweening, tween;
      let mousePos = {},
        svgTop,
        svgLeft;

      const direction = component.getAttribute("data-direction");

      function elasticLineComponentInit() {
        svgElement = component.querySelector("svg");
        path = svgElement.querySelector(".elastic-line-component-curve");

        elasticLineComponentSetSVGTopLeft();
        elasticLineComponentAddListeners();
        elasticLineComponentLoop();
      }

      function elasticLineComponentSetSVGTopLeft() {
        svgTop = svgElement.getBoundingClientRect().top;
        svgLeft = svgElement.getBoundingClientRect().left;
      }

      function elasticLineComponentAddListeners() {
        window.addEventListener("mousemove", function (e) {
          mousePos.y = e.clientY - svgTop;
          mousePos.x = e.clientX - svgLeft;
        });

        window.addEventListener("resize", elasticLineComponentSetSVGTopLeft);

        path.addEventListener("mouseover", function () {
          if (!connected && !tweening) {
            connected = true;
            svgElement.style.cursor = "pointer";
          }
        });
      }

      function elasticLineComponentUpdateCurve() {
        if (direction === "horizontal") {
          let y = mousePos.y;
          y = mousePos.y - (150 - mousePos.y) * 1.1;

          if (Math.abs(150 - y) > 100) {
            connected = false;
            tweening = true;
            svgElement.style.cursor = "default";

            elasticLineComponentSnapBack(y);
          } else {
            path.setAttribute("d", "M10,150 Q200," + y + " 390,150");
          }
        } else if (direction === "vertical") {
          let x = mousePos.x;
          x = mousePos.x - (150 - mousePos.x) * 1.1;

          if (Math.abs(150 - x) > 100) {
            connected = false;
            tweening = true;
            svgElement.style.cursor = "default";

            elasticLineComponentSnapBack(x);
          } else {
            path.setAttribute("d", "M10,150 Q200," + x + " 390,150");
          }
        }
      }

      function elasticLineComponentSnapBack(val) {
        if (direction === "horizontal") {
          tween = new TWEEN.Tween({ y: val })
            .to({ y: 150 }, 800)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
              elasticLineComponentUpdatePath(this.y);
            })
            .onComplete(function () {
              tweening = false;
            })
            .start();
        } else if (direction === "vertical") {
          tween = new TWEEN.Tween({ x: val })
            .to({ x: 150 }, 800)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
              elasticLineComponentUpdatePath(this.x);
            })
            .onComplete(function () {
              tweening = false;
            })
            .start();
        }
      }

      function elasticLineComponentUpdatePath(val) {
        path.setAttribute("d", "M10,150 Q200," + val + " 390,150");
      }

      function elasticLineComponentLoop(time) {
        if (connected) elasticLineComponentUpdateCurve();

        TWEEN.update(time);

        requestAnimationFrame(elasticLineComponentLoop);
      }

      elasticLineComponentInit();
    });
}

window.onload = init;
