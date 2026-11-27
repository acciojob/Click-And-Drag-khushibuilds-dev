const container = document.querySelector('.items');
const cubes = document.querySelectorAll('.item');

let activeCube = null;
let offsetX = 0;
let offsetY = 0;
let initialized = false;

// Sabhi .item cubes ki initial position lock karein taaki ek cube drag karne par baaki shift na hon
function lockInitialPositions() {
  if (initialized) return;

  const containerRect = container.getBoundingClientRect();
  const coords = Array.from(cubes).map((cube) => {
    const rect = cube.getBoundingClientRect();
    return {
      left: rect.left - containerRect.left - container.clientLeft + container.scrollLeft,
      top: rect.top - containerRect.top - container.clientTop + container.scrollTop,
    };
  });

  cubes.forEach((cube, index) => {
    cube.style.position = 'absolute';
    cube.style.margin = '0';
    cube.style.left = `${coords[index].left}px`;
    cube.style.top = `${coords[index].top}px`;
  });

  initialized = true;
}

// Har individual cube (.item) par drag selection lagayein
cubes.forEach((cube) => {
  cube.addEventListener('mousedown', (e) => {
    e.preventDefault();
    lockInitialPositions();

    activeCube = cube;
    activeCube.classList.add('active');
    activeCube.style.zIndex = '1000';
    activeCube.style.cursor = 'grabbing';

    const cubeRect = activeCube.getBoundingClientRect();
    offsetX = e.clientX - cubeRect.left;
    offsetY = e.clientY - cubeRect.top;
  });
});

// Mouse move par sirf selected cube ko move karein aur container boundary ke andar rakhein
document.addEventListener('mousemove', (e) => {
  if (!activeCube) return;
  e.preventDefault();

  const containerRect = container.getBoundingClientRect();

  let newLeft = e.clientX - containerRect.left - container.clientLeft - offsetX;
  let newTop = e.clientY - containerRect.top - container.clientTop - offsetY;

  // Boundary constraints (.items container ke bahar na jaye)
  const maxLeft = container.clientWidth - activeCube.offsetWidth;
  const maxTop = container.clientHeight - activeCube.offsetHeight;

  newLeft = Math.max(0, Math.min(newLeft, maxLeft));
  newTop = Math.max(0, Math.min(newTop, maxTop));

  activeCube.style.left = `${newLeft}px`;
  activeCube.style.top = `${newTop}px`;
});

// Mouse release par cube ko nayi jagah drop karein
document.addEventListener('mouseup', () => {
  if (!activeCube) return;

  activeCube.classList.remove('active');
  activeCube.style.zIndex = '';
  activeCube.style.cursor = 'grab';
  activeCube = null;
});
