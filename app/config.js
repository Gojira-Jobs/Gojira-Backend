const errors={
    ACCEPTED:{code:"200",msg:"ok"},
    CREATED:{code:"201",msg:"Item Created"},
    BADREQUEST:{code:"400",msg:"Bad Request to server"},
    UNAUTHORIZED:{code:"401",msg:"UnAuthorized User"},
    FORBIDDEN:{code:"403",msg:"Problem In request"},
    NOTFOUND:{code:'404',msg:"Not Found"},
    INTERNAL:{code:"500",msg:"Server Internal Error"},
    AUTHORIZED:{code:"202",msg:"User Verified"}
}
module.exports=errors;