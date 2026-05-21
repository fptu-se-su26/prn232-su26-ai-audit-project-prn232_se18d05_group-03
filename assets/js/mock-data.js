// Mock API providing temporary interactive data for the static demo
window.MockAPI = (function(){
  const patients = [
    { id: 1, name: 'Robert Jameson', age: 62, idNo: '992-102-441' },
    { id: 2, name: 'Elena Rodriguez', age: 68, idNo: 'PX-99283-00' },
    { id: 3, name: 'Sarah Jenkins', age: 38, idNo: 'SC-99201' }
  ];

  const appointments = [
    { id: 'A1', patientId: 1, time: '09:30', type: 'In-Person', clinician: 'Dr. Sarah Jenkins' },
    { id: 'A2', patientId: 2, time: '11:00', type: 'Telemedicine', clinician: 'Dr. Elena Rodriguez' }
  ];

  const labs = [
    { id: 'L1', patientId: 1, name: 'CMP', status: 'Completed', date: '2024-10-12' },
    { id: 'L2', patientId: 2, name: 'CBC', status: 'Pending', date: '2024-11-01' }
  ];

  const queue = [
    { id: '#A-108', name: 'Robert Williams', room: 'Room 301', wait: '32m', status: 'Waiting', statusType: 'waiting' },
    { id: '#A-109', name: 'Elena Rodriguez', room: 'Room 302', wait: '10m', status: 'In Progress', statusType: 'in-progress' },
    { id: '#B-031', name: 'Mark Thompson', room: 'Room 301', wait: '5m', status: 'In Progress', statusType: 'in-progress' },
    { id: '#C-093', name: 'Sarah Jenkins', room: 'Room 304', wait: '--', status: 'Completed', statusType: 'completed' }
  ];

  const labOrders = [
    { id: 'ORD-8821', patient: 'Robert Williams', order: 'Comprehensive Metabolic Panel', priority: 'STAT', time: '12 mins ago', clinician: 'Dr. Sarah Chen' },
    { id: 'ORD-8790', patient: 'Elena Rodriguez', order: 'Lipid Profile', priority: 'Routine', time: '1h 45m ago', clinician: 'Dr. Mark Walton' },
    { id: 'ORD-8755', patient: 'Thomas Jenkins', order: 'Chest X-Ray (AP/Lat)', priority: 'Routine', time: '2h 10m ago', clinician: 'Dr. Linda Blair' }
  ];

  const kpis = [
    { label: 'Total Revenue', value: '$4,284,500', trend: '+12.5%' },
    { label: 'Bed Occupancy', value: '88.4%', trend: 'Critical' },
    { label: 'Daily Outpatient', value: '1,142', trend: '-2.1%' }
  ];

  function asyncDelay(result, ms = 200){
    return new Promise(resolve => setTimeout(() => resolve(result), ms));
  }

  return {
    getPatients: () => asyncDelay(patients.slice()),
    getAppointments: () => asyncDelay(appointments.slice()),
    getLabResults: (patientId) => asyncDelay(labs.filter(l => !patientId || l.patientId === patientId)),
    findPatient: (id) => asyncDelay(patients.find(p => p.id === id) || null),
    getQueue: () => asyncDelay(queue.slice()),
    getLabOrders: () => asyncDelay(labOrders.slice()),
    getKpis: () => asyncDelay(kpis.slice())
  };
})();
