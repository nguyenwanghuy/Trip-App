import ReplyCmtModel from "../models/replyCmtModel.js";


const createReplyCmt = async (req, res) => {
    try {
        const {description} = req.body;
        const cmtId = req.params.idCmt;
        const {id}= req.user.id;
    
       const newRepltCmt = new ReplyCmtModel({
        description,
        cmtId,
        id
       })
      
       await newRepltCmt.save();
      
        res.json({
            message: 'ReplyComment created',
            reply: newRepltCmt
        })
       } catch (error) {
        res.status(500).send(error)
       } 
};
const getReplyCmt = async (req, res) => {
    const replyCmt = await ReplyCmtModel.find()
    if(!replyCmt) return res.status(400).json({message: 'ReplyComment not found'})
    res.json({
        data: replyCmt
    })
};
const updateReplyCmt = async (req, res) => {
    try {
        const {description} = req.body;
        const cmtId = req.params.idCmt;
        const updateReplyCmt = await ReplyCmtModel.findOneAndUpdate(
            {_id: cmtId},
            {
                description: description
            },
            {
                new: true,
            }
           )
           return res.json({
            message: 'Update successfully',
            data: updateReplyCmt
          })
          } catch (error) {
           res.status(500).send(error)
          }
};
const deleteReplyCmt = async (req, res) => {
    try {
        const {id} = req.user
        const cmtId = req.params.idCmt;
        const existingReplyCmt = await ReplyCmtModel.findByIdAndDelete(
            {_id:cmtId, user:id}
        )
        res.json({
            message: 'Delete comment successfully',
            data : existingReplyCmt
        })
    } catch (error) {
        res.status(400).json({
            message: "Delete failed",
          })}
};

const ReplyCmtCtrl = {
    createReplyCmt,
    getReplyCmt,
    updateReplyCmt,
    deleteReplyCmt
}
export default ReplyCmtCtrl