// Small app helpers to wire mock data into static pages
(function(){
  function renderList(container, items, itemRenderer){
    container.innerHTML = '';
    items.forEach(it => container.appendChild(itemRenderer(it)));
  }

  function createPatientItem(p){
    const el = document.createElement('div');
    el.className = 'p-3 border-b border-outline-variant flex justify-between items-center';
    el.innerHTML = `<div><div class="font-semibold">${p.name}</div><div class="text-xs text-gray-500">ID: ${p.idNo} • Age: ${p.age}</div></div><a class="text-primary" href="view_record.html?pid=${p.id}">Open</a>`;
    return el;
  }

  function renderPatients(container){
    window.MockAPI.getPatients().then(list => renderList(container, list, createPatientItem));
  }

  function renderAppointments(container){
    window.MockAPI.getAppointments().then(list => {
      container.innerHTML = list.map(a => `
        <div class="p-2 border-b flex justify-between items-center">
          <div>
            <div class="font-medium">${a.clinician}</div>
            <div class="text-xs text-gray-500">${a.time} • ${a.type}</div>
          </div>
          <a class="text-primary" href="view_record.html?pid=${a.patientId}">View</a>
        </div>
      `).join('');
    });
  }

  function statusClass(type){
    if(type === 'waiting') return 'bg-error text-white';
    if(type === 'completed') return 'bg-tertiary text-white';
    if(type === 'in-progress') return 'bg-secondary text-white';
    return 'bg-surface-dim text-on-surface-variant';
  }

  function renderQueue(container){
    window.MockAPI.getQueue().then(list => {
      if(container.tagName === 'TBODY'){
        container.innerHTML = list.map(row => `
          <tr class="hover:bg-surface-bright transition-colors group">
            <td class="px-gutter py-md font-code text-code text-primary font-bold">${row.id}</td>
            <td class="px-gutter py-md font-body-sm text-body-sm font-semibold">${row.name}</td>
            <td class="px-gutter py-md font-body-sm text-body-sm text-on-surface-variant">${row.room}</td>
            <td class="px-gutter py-md font-body-sm text-body-sm">${row.wait}</td>
            <td class="px-gutter py-md">
              <span class="px-2 py-1 rounded ${statusClass(row.statusType)} font-label-sm text-label-sm">${row.status}</span>
            </td>
            <td class="px-gutter py-md text-right">
              <a class="text-primary hover:underline" href="view_record.html">Open</a>
            </td>
          </tr>
        `).join('');
        return;
      }

      container.innerHTML = list.map(row => `
        <div class="p-2 border-b flex items-center justify-between">
          <div>
            <div class="font-medium">${row.name}</div>
            <div class="text-xs text-gray-500">${row.id} • ${row.room} • ${row.wait}</div>
          </div>
          <span class="px-2 py-1 rounded ${statusClass(row.statusType)} text-xs">${row.status}</span>
        </div>
      `).join('');
    });
  }

  function renderLabOrders(container){
    window.MockAPI.getLabOrders().then(list => {
      container.innerHTML = list.map(order => `
        <div class="p-3 border-b border-outline-variant hover:bg-surface-container-low transition-all">
          <div class="flex justify-between items-start mb-xs">
            <span class="font-label-md text-label-md text-on-surface">${order.patient}</span>
            <span class="px-2 py-0.5 ${order.priority === 'STAT' ? 'bg-error text-on-error' : 'bg-surface-dim text-on-surface-variant'} font-label-sm text-label-sm rounded-lg">${order.priority}</span>
          </div>
          <div class="font-body-sm text-body-sm text-on-surface-variant mb-sm">Order #${order.id} • ${order.order}</div>
          <div class="flex justify-between items-center">
            <span class="font-label-sm text-label-sm text-outline">${order.time}</span>
            <span class="font-label-sm text-label-sm text-primary">${order.clinician}</span>
          </div>
        </div>
      `).join('');
    });
  }

  function renderKpis(container){
    window.MockAPI.getKpis().then(list => {
      container.innerHTML = list.map(kpi => `
        <div class="p-3 border rounded-lg border-outline-variant bg-surface-container-lowest">
          <div class="text-xs text-on-surface-variant uppercase">${kpi.label}</div>
          <div class="text-lg font-semibold mt-1">${kpi.value}</div>
          <div class="text-xs text-on-surface-variant mt-1">${kpi.trend}</div>
        </div>
      `).join('');
    });
  }

  function renderMockBlocks(){
    document.querySelectorAll('[data-mock]').forEach(container => {
      const type = container.getAttribute('data-mock');
      if(type === 'patients') renderPatients(container);
      if(type === 'appointments') renderAppointments(container);
      if(type === 'queue') renderQueue(container);
      if(type === 'lab-orders') renderLabOrders(container);
      if(type === 'kpis') renderKpis(container);
    });
  }

  function wireToggles(){
    document.querySelectorAll('[data-toggle="sidebar"]').forEach(btn => {
      btn.addEventListener('click', () => document.body.classList.toggle('sidebar-collapsed'));
    });
  }

  function init(){
    renderMockBlocks();
    wireToggles();

    // Simple demo: if view_record page, parse pid and show details
    if(location.pathname.endsWith('view_record.html')){
      const params = new URLSearchParams(location.search);
      const pid = Number(params.get('pid')) || null;
      const target = document.getElementById('mock-record');
      if(target){
        if(pid){
          window.MockAPI.findPatient(pid).then(p => {
            if(p) target.innerHTML = `<h2 class="text-xl font-semibold">${p.name}</h2><p class="text-sm text-gray-600">ID: ${p.idNo} • Age: ${p.age}</p>`;
            else target.textContent = 'Record not found';
          });
        } else {
          target.textContent = 'No patient selected';
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.App = { init };
})();
