const chatService = require("../services/chatService");

exports.chat = async(req,res)=>{

  try{

    const {message} = req.body;

    const reply = await chatService.chatBot(message);

    res.json(reply);

  }catch(err){

    res.status(500).json({
      text:"Server lỗi"
    });

  }

};