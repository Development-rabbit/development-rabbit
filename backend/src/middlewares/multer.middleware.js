import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'./public/temp')
    },
    filename : function (req,file,cb) {
        // Unique per upload — a failed Bunny upload keeps this file on disk
        // for retry, so two uploads of the same filename must not collide.
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})


export const upload = multer({storage})