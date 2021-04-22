const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");

const times = [];
for (i = 0; i <= 1; i += 0.07) {
  let x = Math.pow(i, 5);
  times.unshift(450 - Math.ceil(50 + 3.5 * x * 100));
}

console.log(times);
const animate = (el, callback = () => {}) => {
  el.animate(
    [
      {
        transform: "rotate(0deg)",
      },
      {
        transform: "rotate(-720deg)",
      },
    ],
    {
      duration: 2000,
      fill: "forwards",
      iterations: 1,
    }
  ).finished.then(() => callback());
};

//animate(ball1, () => animate(ball2));

const anims = [];

const move = async (el, y0, y1, duration = 700) => {
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
  anims.push(aOBJ);
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
  anims.push(aOBJ);
  return aOBJ.finished;
};

/*bounce(ball1, ball1.offsetTop, 400).then(() => {
  bounce(ball1, 400, 200).then(() => {
    bounce(ball1, 200, 400).then(() => {
      bounce(ball1, 400, 300).then(() => {
        bounce(ball1, 300, 400);
      });
    });
  });
});*/

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
    await move(el, time, yMax);
    await move(el, yMax, times[index + 1] || yMax);
  });
  //let ani = await move(ball1, ball1.offsetTop, 400);
  //ani = await move(ball1, 400, 200);
};

const infinityRoll = async (el, speed) => {
  await asyncLoop(async () => {
    await roll(el, speed);
  });
};

const roll = async (el, speed) => {
  let origin = el.offsetLeft;
  let distance = Math.round(el.offsetHeight * Math.PI);
  let animation = el.animate(
    [
      {
        left: origin + "px",
        transform: "rotate(0deg)",
      },
      {
        left: origin - distance + "px",
        transform: "rotate(-360deg)",
      },
    ],
    {
      duration: speed,
      fill: "forwards",
      iterations: 1,
    }
  );
  return animation.finished;
};
const myAnimation = async () => {
  infinityRoll(ball1, 1000);
  await moveX(ball1, ball1.offsetLeft, ball1.offsetLeft - 35, 10000);
  bounce(ball1).then(() => {
    const animations = ball1.getAnimations();
    setTimeout(() => {
      animations[0].pause();
      animations[1].pause();
      animations[2].pause();
      animations[3].pause();
      animations[4].pause();
      animations[5].pause();
      animations[6].pause();
      animations[7].pause();
    }, 500);
  });
  moveX(ball1, ball1.offsetLeft, ball1.offsetLeft - 5000, 4000);
};

const myAnimation2 = async () => {
  //roll ball to the edge
  let ballSize = ball1.offsetWidth;
  let timeToTheEdge = ballSize / (ballSize * Math.PI);
  infinityRoll(ball1, 5000);
};

myAnimation();
/*const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const start = async () => {
  await asyncForEach([1, 2, 3], async (num) => {
    await waitFor(500);
    console.log(num);
  });
  console.log("Done");
};
start();*/
