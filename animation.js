import {
  spline,
  pointsInPath,
  createCoordsTransformer
} from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.1";
import gsap from "https://cdn.skypack.dev/gsap@3.6.1";

const buttonPath = document.getElementById("btn-path");

// This function will map the user's mouse position to the view-box.
// const transformCoords = createCoordsTransformer(path.closest("svg"));
function createLiquidPath(path, options) {
  const svgPoints = pointsInPath(path, options.detail);
  const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
  const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

  const mousePos = { x: 0, y: 0 };
  const transformCoords = createCoordsTransformer(path.closest("svg"));

  const pointDistance = Math.hypot(
    originPoints[0].x - originPoints[1].x,
    originPoints[0].y - originPoints[1].y
  );

  //Constraints
  const maxDist = {
    x: options.axis.includes("x") ? pointDistance / 2 : 0,
    y: options.axis.includes("y") ? pointDistance / 2 : 0
  };

  gsap.ticker.add(() => {
    gsap.set(path, {
      attr: {
        d: spline(liquidPoints, options.tension, options.close)
      }
    });
  });

  window.addEventListener("mousemove", (e) => {
    const { x, y } = transformCoords(e);

    mousePos.x = x;
    mousePos.y = y;

    liquidPoints.forEach((point, index) => {
      const pointOrigin = originPoints[index];
      const distX = Math.abs(pointOrigin.x - mousePos.x);
      const distY = Math.abs(pointOrigin.y - mousePos.y);

      if (distX <= options.range.x && distY <= options.range.y) {
        const difference = {
          x: pointOrigin.x - mousePos.x,
          y: pointOrigin.y - mousePos.y
        };

        const target = {
          x: pointOrigin.x + difference.x,
          y: pointOrigin.y + difference.y
        };

        const x = gsap.utils.clamp(
          pointOrigin.x - maxDist.x,
          pointOrigin.x + maxDist.x,
          target.x
        );

        const y = gsap.utils.clamp(
          pointOrigin.y - maxDist.y,
          pointOrigin.y + maxDist.y,
          target.y
        );

        gsap.to(point, {
          x: x,
          y: y,
          ease: "sine",
          overwrite: true,
          duration: 0.175,
          onComplete() {
            gsap.to(point, {
              x: pointOrigin.x,
              y: pointOrigin.y,
              ease: "elastic.out(1, 0.3)",
              duration: 1.25
            });
          }
        });
      }
    });
  });
}
// //detail is how many points the original <path> should be split into
// //tension a value between (0 and 1), how smooth the curve should be
// //close, tells spline if our path data should be close shape
// //range
// //axis, define which axis should our points move on.

const prefersReducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
  createLiquidPath(buttonPath, {
    detail: 32,
    tension: 1,
    close: true,
    range: {
      x: 12,
      y: 40
    },
    axis: ["y"]
  });
}