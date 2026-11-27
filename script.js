const container = document.querySelector('.items');
const cubes = document.querySelectorAll('.item');

let activeCube = null;
let offsetX = 0;
let offsetY = 0;
let initialized = false;

// Initial positions lock karein taaki ek cube move hone par baaki cubes shift na hon
function lockInitialPositions() {
  if (initialized) return;

  const coords = Array.from(cubes).map((cube) => ({
    left: cube.offsetLeft,
    top: cube.offsetTop,
  }));

  cubes.forEach((cube, index) => {
    cube.style.position = 'absolute';
    cube.style.margin = '0';
    cube.style.left = `${coords[index].left}px`;
    cube.style.top = `${coords[index].top}px`;
  });

  initialized = true;
}

// Har individual cube (.item) par mousedown selection lagayein
cubes.forEach((cube) => {
  cube.addEventListener('mousedown', (e) => {
    e.preventDefault();
    lockInitialPositions();

    activeCube = cube;
    activeCube.classList.add('active');
    activeCube.style.zIndex = '1000';
    activeCube.style.cursor = 'grabbing';

    offsetX = e.clientX - activeCube.offsetLeft;
    offsetY = e.clientY - activeCube.offsetTop;
  });
});

// Mouse move par cube ko container boundaries ke andar strictly clamp karein
document.addEventListener('mousemove', (e) => {
  if (!activeCube) return;
  e.preventDefault();

  let newLeft = e.clientX - offsetX;
  let newTop = e.clientY - offsetY;

  // Container ke inner bounds calculate karein (border aur dimensions ke saath)
  const minLeft = 0;
  const minTop = 0;
  const maxLeft = Math.max(0, container.clientWidth - activeCube.offsetWidth);
  const maxTop = Math.max(0, container.clientHeight - activeCube.offsetHeight);

  // Clamp coordinates strictly inside [0, max]
  newLeft = Math.min(Math.max(minLeft, newLeft), maxLeft);
  newTop = Math.min(Math.max(minTop, newTop), maxTop);

  activeCube.style.left = `${newLeft}px`;
  activeCube.style.top = `${newTop}px`;

  // Extra visual check: agar CSS 3D transform (scaleX/rotateY) ki wajah se
  // cube ka rendered edge container ke bahar ja raha ho toh use wapas andar adjust karein
  const containerRect = container.getBoundingClientRect();
  const cubeRect = activeCube.getBoundingClientRect();

  if (cubeRect.left < containerRect.left + container.clientLeft) {
    const diff = containerRect.left + container.clientLeft - cubeRect.left;
    newLeft += diff;
  } else if (cubeRect.right > containerRect.right - container.clientLeft) {
    const diff = cubeRect.right - (containerRect.right - container.clientLeft);
    newLeft -= diff;
  }

  if (cubeRect.top < containerRect.top + container.clientTop) {
    const diff = containerRect.top + container.clientTop - cubeRect.top;
    newTop += diff;
  } else if (cubeRect.bottom > containerRect.bottom - container.clientTop) {
    const diff = cubeRect.bottom - (containerRect.bottom - container.clientTop);
    newTop -= diff;
  }

  // Final strict clamp
  newLeft = Math.min(Math.max(minLeft, newLeft), maxLeft);
  newTop = Math.min(Math.max(minTop, newTop), maxTop);

  activeCube.style.left = `${newLeft}px`;
  activeCube.style.top = `${newTop}px`;
});

// Mouse release par cube ko drop karein
document.addEventListener('mouseup', () => {
  if (!activeCube) return;

  activeCube.classList.remove('active');
  activeCube.style.zIndex = '';
  activeCube.style.cursor = 'grab';
  activeCube = null;
});
