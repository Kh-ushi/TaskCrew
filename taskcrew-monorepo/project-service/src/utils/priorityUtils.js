const mongoose = require('mongoose');

const computeAllPriorirties = (projects) => {

    const normalized = projects.map((p) => {

        let due;
        if (p.dueDate) {
            due = p.dueDate instanceof Date ? p.dueDate : new Date(p.dueDate);;
        }
        else {
            due = new Date('9999-12-31');
        }
        return {
            id: p._id.toString(),
            name: p.name,
            description: p.description,
            dueDate: due,
            priority:p.priority
        }
    });

    const urgentWords = ["urgent", "asap", "immediately", "important", "emergency", "critical"];
    const flagged = new Set();


    normalized.forEach((p) => {
        const text = p.name + ' ' + p.description;
        for (const word of urgentWords) {
            if (text.toLowerCase().includes(word)) {
                flagged.add(p.id);
                break;
            }
        }
    });

    const toRank = normalized.filter((p) => !flagged.has(p.id));

    toRank.sort((a,b)=>{
        if(a.dueDate<b.dueDate)return -1;
        if(a.dueDate>b.dueDate)return 1;
        return a.name.localeCompare(b.name);
    })
   

  const N = toRank.length;
  const bucketSize = Math.ceil(N / 3);

  const mapping = {};

  flagged.forEach((id)=>{
    mapping[id]='high';
  })

    for (let i = 0; i < N; i++) {
        const id = toRank[i].id;
        if (i < bucketSize) {
        mapping[id] = 'high';
        } else if (i < 2 * bucketSize) {
        mapping[id] = 'medium';
        } else {
        mapping[id] = 'low';
        }
    }


    return mapping;

}


module.exports = { computeAllPriorirties };