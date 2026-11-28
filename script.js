<script>
  const container = document.querySelector('.items');
  const cubes = document.querySelectorAll('.item');

  let activeCube = null;
  let offsetX = 0;
  let offsetY = 0;
  let initialized = false;

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

  cubes.forEach((cube) => {
    cube.addEventListener('mousedown', (e) => {
      e.preventDefault();
      lockInitialPositions();

      activeCube = cube;
      activeCube.classList.add('active');

      const containerRect = container.getBoundingClientRect();
      offsetX = e.clientX - containerRect.left - activeCube.offsetLeft;
      offsetY = e.clientY - containerRect.top - activeCube.offsetTop;
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!activeCube) return;
    e.preventDefault();

    const containerRect = container.getBoundingClientRect();
    let newLeft = e.clientX - containerRect.left - offsetX;
    let newTop = e.clientY - containerRect.top - offsetY;

    const maxLeft = container.clientWidth - activeCube.offsetWidth;
    const maxTop = container.clientHeight - activeCube.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    activeCube.style.left = `${newLeft}px`;
    activeCube.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!activeCube) return;

    activeCube.classList.remove('active');
    activeCube = null;
  });
</script>
