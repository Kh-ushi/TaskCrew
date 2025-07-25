import mongoose from "mongoose";
import Grid from "gridfs-stream";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

const conn = mongoose.connection;
let gfs, gridfsBucket;

conn.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

const storage = new GridFsStorage({
    db: conn,
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "uploads"
    })
});

export const upload = multer({ storage });
export { gfs, gridfsBucket };