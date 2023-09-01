document.getElementById('settings').addEventListener('click', function () {
    const drawer = document.getElementById("control-drawer");
    drawer.style.right = 0
})

document.getElementById("close-drawer").addEventListener("click", function () {
  const drawer = document.getElementById("control-drawer");
  drawer.style.right = '-100%';
});