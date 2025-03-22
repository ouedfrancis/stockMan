
if(typeof sidebarMenu == 'undefined')
{
let sidebarMenu = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
if(sidebarBtn!=null)
sidebarBtn.onclick = function() {
  sidebarMenu.classList.toggle("active");
  if(sidebarMenu.classList.contains("active")){
  sidebarBtn.classList.replace("bx-menu" ,"bx-menu-alt-right");
}else
  sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}
}