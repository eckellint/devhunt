function toast(message){
  const el=document.getElementById('toast');
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
}
function toggleFollow(btn){
  const followed=btn.classList.toggle('followed');
  btn.textContent=followed?'✓ Suivi':'♡ Suivre';
  toast(followed?'Bienvenue dans la Squad ! 🎉':'Suivi retiré.');
}
function showMessage(){toast('Message prêt ! 💬 À bientôt dans la Squad.')}
function showEvent(){toast('Participation enregistrée ! 🎊')}
function likePost(btn){
  const liked=btn.classList.toggle('liked');
  btn.textContent=liked?'♥ J’aime':'♡ J’aime';
  toast(liked?'Merci pour le love ❤️':'Like retiré.');
}
