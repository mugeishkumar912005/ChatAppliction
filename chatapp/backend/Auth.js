const M=require('mongoose');
const B=require('body-parser');
const Ex=require('express');
const C=require('cors')
const{Mod}=require('./Uschema.js');
const User=M.model('User', Mod);
const App=Ex();
App.use(B.json());
App.use(C());
const DbConnection=async ()=>{
    try{
        await M.connect('mongodb+srv://kmugeis2005:dontforgetit@mugeishhero.ggr3iod.mongodb.net/KeepintouchUserDb?retryWrites=true&w=majority&appName=mugeishhero');
        console.log("DB Connection Success");
    }catch(error){
        console.log("Opps!Server Error:"+error);
    }
      
}
DbConnection();
App.post('/AddUser',async (request,response)=>{
        try{
           const {Username,Phone_no,Email,Password}=request.body;
           const NewUser= await User.create({'Username':Username,'Phone_no':Phone_no,'Email':Email,'Password':Password});
           NewUser.save()
           response.status(200).json({
            'Msg':"Succesfull Addition",
            NewUser
           })

        }catch(error){
            response.status(404).json({
                "Msg":"Opps! Something Went Wrong"
            })
        }
})
const P=process.env.PORT || 5500;
App.listen(P,()=>{
    console.log(`Server Connected in ${P}`);
})
