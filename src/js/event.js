document.getElementById('settings').addEventListener('click', function () {
    const drawer = document.getElementById("control-drawer");
    drawer.style.right = 0
})

document.getElementById("close-drawer").addEventListener("click", function () {
  const drawer = document.getElementById("control-drawer");
  drawer.style.right = '-100%';
});

document.getElementById('btn').addEventListener("click", function () {
  const introbody = document.getElementById('intro-body')
  introbody.style.right = '-100%';
})

document.getElementById("toggle").addEventListener("click", function () {
  const btn = document.getElementById("team-list");
  btn.style.display = "block";
});

document.querySelector(".close p").addEventListener("click", function () {
  const btn = document.getElementById("team-list");
  btn.style.display = "none";
});