const multer=require("multer");
const fs=require('fs');
const path=require("path");

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const uploadPath="uploads/projectImages";
    fs.mkdirSync(uploadPath,{recursive:true});
    cb(null,uploadPath);
  },
  filename:(req,file,cb)=>{
    const ext=path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + ext;
    cb(null,filename);
  }
});

const fileFilter=(req,file,cb)=>{
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload=multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
})


module.exports=upload;