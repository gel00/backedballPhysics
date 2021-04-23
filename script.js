const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");

const times = [];

for (i = 0; i <= 1; i += 0.07) {
  let x = Math.pow(i, 5);
  times.unshift(450 - Math.ceil(50 + 3.5 * x * 100));
}

const moveY = async (el, y0, y1, duration = 700) => {
  const distance = Math.abs(y0 - y1);
  duration = (distance / 350) * duration;
  const aOBJ = el.animate(
    [
      {
        top: y0 + "px",
      },
      {
        top: y1 + "px",
      },
    ],
    {
      duration: duration,
      fill: "forwards",
      iterations: 1,
      easing: y0 < y1 ? "ease-in" : "ease-out",
    }
  );
  return aOBJ.finished;
};
const moveX = async (el, x0, x1, duration = 700) => {
  const distance = Math.abs(x0 - x1);
  duration = (distance / 350) * duration;
  const aOBJ = el.animate(
    [
      {
        left: x0 + "px",
      },
      {
        left: x1 + "px",
      },
    ],
    {
      duration: duration,
      fill: "forwards",
      iterations: 1,
    }
  );
  return aOBJ.finished;
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
async function asyncLoop(callback) {
  for (let index = 0; index < 1000; index++) {
    await callback();
  }
}

const bounce = async (el) => {
  await asyncForEach(times, async (time, index, times) => {
    let yMax = times[times.length - 1];
    await moveY(el, time, yMax);
    await moveY(el, yMax, times[index + 1] || yMax);
  });
};

const infinityRoll = async (el, speed) => {
  await asyncLoop(async () => {
    await roll(el, speed);
  });
};

const roll = async (
  el,
  distance,
  duration,
  direction = "left",
  startDeg = 0
) => {
  direction = direction === "left" ? -1 : 1;
  let origin = el.offsetLeft;
  let deg =
    (360 * direction * distance) / Math.round(el.offsetHeight * Math.PI);
  let animation = el.animate(
    [
      {
        left: origin + "px",
        transform: "rotate(" + startDeg + "deg)",
      },
      {
        left: origin - distance + "px",
        transform: "rotate(" + deg + "deg)",
      },
    ],
    {
      duration: duration,
      fill: "forwards",
      iterations: 1,
      easing: "ease-out",
    }
  );
  animation.deg = deg;
  return animation.finished;
};

const myAnimation2 = async () => {
  //roll ball to the edge
  bounce(ball2);
  setTimeout(async () => {
    await roll(ball1, 35, 2000, "left", 0);
    await (() => {
      roll(ball1, 300, 3500, "left", -114.65);
      bounce(ball1);
    })();
  }, 650);
};

myAnimation2();
