const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");

// This fn returns an array of distances for the bounce animation
//elasticity has to be between: 5 , 0.1
const getParabola = (totalYDistance, ballsize, elasticity) => {
  const yCoordinates = [];
  for (i = 0; i <= 1; i += elasticity / 10) {
    let x = Math.pow(i, 5);
    yCoordinates.unshift(
      totalYDistance + ballsize - Math.ceil(ballsize + 3.5 * x * 100)
    );
  }
  return yCoordinates;
};
//an array Y cordinates, that mimics the physics of a basketball
const bounceDistances = getParabola(400, 50, 0.75);

//transform Y animation, from y0 to y1
//returns a promise
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

//transform x animation, from x0 to x1
//returns a promise
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
// an async foreach
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// an async foreach over the parabolicYCordinates
// each iteration execute a tansitionY animation
const bounce = async (el) => {
  await asyncForEach(bounceDistances, async (time, index, bounceDistances) => {
    let yMax = bounceDistances[bounceDistances.length - 1];
    await moveY(el, time, yMax);
    await moveY(el, yMax, bounceDistances[index + 1] || yMax);
  });
};

// Calculate the angle of rotation based on distance and speed by using the  circumference of the element.
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

//animation to run
const myAnimation2 = async () => {
  //drop ball2
  bounce(ball2);
  //after 650ms
  setTimeout(async () => {
    //roll ball1 to the edge
    await roll(ball1, 35, 2000, "left", 0);
    //than drop ball1 and roll further
    await (() => {
      //hardcoded start angle and duration
      roll(ball1, 300, 3500, "left", -114.65);
      bounce(ball1);
    })();
  }, 650);
};

myAnimation2();
