function q(id){return document.getElementById(id)}
const sceneSelect = document.getElementById('sceneSelect');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

async function readFileAsDataURL(file){
  return new Promise((resolve, reject)=>{
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  })
}

async function gatherParams(){
  const params = {
    scene: sceneSelect && sceneSelect.value ? sceneSelect.value : '01-thumbnail',
    width: widthInput && widthInput.value ? Number(widthInput.value) : 1600,
    height: heightInput && heightInput.value ? Number(heightInput.value) : 900,
    // legacy keys maintained for server fallback
    url: (q('url').value || '').trim() || undefined,
    title: (q('title').value || '').trim() || undefined,
    subtitle: (q('subtitle').value || '').trim() || undefined,
    icon: (q('icon').value || '').trim() || undefined,
    image: (q('image').value || '').trim() || undefined,
    imageLeft: (q('imageLeft') && q('imageLeft').value || '').trim() || undefined,
    imageRight: (q('imageRight') && q('imageRight').value || '').trim() || undefined,
    bgcolor: (q('bgcolor').value || '').trim() || undefined,
    background: (q('theme').value || '').trim() || undefined
  }
  const f = q('imageFile') && q('imageFile').files && q('imageFile').files[0]
  if(f){
    try { params.image = await readFileAsDataURL(f) } catch(e) { console.log('file read failed', e) }
    const prev = q('imagePreview'); if(prev){ prev.src = URL.createObjectURL(f); prev.hidden = false }
  }
  const fl = q('imageFileLeft') && q('imageFileLeft').files && q('imageFileLeft').files[0]
  if(fl){
    try { params.imageLeft = await readFileAsDataURL(fl) } catch(e) { console.log('file read failed', e) }
    const prev = q('imagePreviewLeft'); if(prev){ prev.src = URL.createObjectURL(fl); prev.hidden = false }
  }
  const fr = q('imageFileRight') && q('imageFileRight').files && q('imageFileRight').files[0]
  if(fr){
    try { params.imageRight = await readFileAsDataURL(fr) } catch(e) { console.log('file read failed', e) }
    const prev = q('imagePreviewRight'); if(prev){ prev.src = URL.createObjectURL(fr); prev.hidden = false }
  }
  return params
}

// File input preview on change
const fileInput = q('imageFile')
if(fileInput){
  fileInput.addEventListener('change', async ()=>{
    const f = fileInput.files && fileInput.files[0]
    if(!f) return
    const prev = q('imagePreview'); if(prev){ prev.src = URL.createObjectURL(f); prev.hidden = false }
  })
}
;['Left','Right'].forEach(side => {
  const input = q('imageFile'+side)
  if(input){
    input.addEventListener('change', async ()=>{
      const f = input.files && input.files[0]
      if(!f) return
      const prev = q('imagePreview'+side); if(prev){ prev.src = URL.createObjectURL(f); prev.hidden = false }
    })
  }
})

// Preview HTML via POST /api/compose and open in new tab
// Deprecated: central preview button removed

// Download PNG via POST /api/screenshot
// Deprecated: central download button removed

// Populate scenes on load
(async () => {
  if(!sceneSelect) return;
  try {
    const res = await fetch('/api/scenes');
    if(!res.ok) return;
    const data = await res.json();
    const scenes = (data && data.scenes) || [];
    sceneSelect.innerHTML = scenes.map(s => `<option value="${s}">${s}</option>`).join('');
    if (!sceneSelect.value && scenes.length) sceneSelect.value = scenes[0];
  } catch(e) {
    console.error('Failed to load scenes', e);
  }
})();

