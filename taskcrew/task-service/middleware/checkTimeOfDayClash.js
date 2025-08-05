import "../models/Task.js";
const checkTimeOfDayClash = (req, res, next) => {
   const {startTime,endTime,assignedTo=[]}=req.body;
   if(!startTime || !endTime || assignedTo.length==0){
    return next();
   }

   const newStart=new Date(startTime);
   const newEnd=new Date(endTime);
   
    
}

export{checkTimeOfDayClash};