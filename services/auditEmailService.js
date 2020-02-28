const uuid = require("uuid");
const axios = require("axios");
const logger = require("../config/logger");
const devToken = require("../config/keys").SECERT_JWT;

function currentDate() {
    var curr = new Date();
    curr.setDate(curr.getDate());
    return curr.toISOString().substr(0, 10);
};

async function ExecuteAuditEmail(ffxAudit) {
    let id = uuid();
    logger.info(id + " === ExecuteAuditEmail Started");

    //Build OP and Support PDF
    var opPDF = null;
    var supportPDF = null;
    await Promise.all([
        axios.post("http://localhost:5000/api/auditPdfBuilder/buildOpAuditPDF" , ffxAudit, { headers: { Authorization: devToken } }),
        axios.post("http://localhost:5000/api/auditPdfBuilder/buildSupportAuditPDF" , ffxAudit, { headers: { Authorization: devToken } })
        ])
        .then(([opPdfResponse, supportPdfResponse]) => {
            opPDF = opPdfResponse.data;
            supportPDF = supportPdfResponse.data;
        })
        .catch(function(error) {
            logger.error(id + " === ExecuteAuditEmail Error");
            console.log(error);
        });

        if(opPDF.length > 100 && supportPDF.length > 100){
            //We have pdfs with data send email now
            var opEmail = null;
            var supportEmail = null;
            var error = false;
            await Promise.all([
                axios.post("http://localhost:5000/api/AuditEmailSender/auditOpEmailSend/" , {opPDF, ffxAudit}, { headers: { Authorization: devToken } }),
                axios.post("http://localhost:5000/api/AuditEmailSender/auditSupportEmailSend/" , {supportPDF, ffxAudit}, { headers: { Authorization: devToken } })
                ])
            .then(([opEmailResponse, supportEmailResponse]) => {
                opEmail = opEmailResponse.data;
                supportEmail = supportEmailResponse.data;
            })
            .catch(function(error) {
                console.log(error);
                error = true;
            });

            if(!error){
                var updateData = {
                    emailSent :  true,
				    dateEmailSent : currentDate(),
				    emailNotSentReason : ""
                }
                //We didnt get an error, so update audits
                logger.info(id + " === updateEmailStatus Started");
                await Promise.all([
                    axios.put("http://localhost:5000/api/ffxAudit/updateEmailStatus" , {ffxAudit, updateData }, { headers: { Authorization: devToken } })
                ])
                .then(([auditUpdateResponse]) => {
                     logger.info(id + " === updateEmailStatus Completed");
                })
                .catch(function(error) {
                    //Error with updating audit record
                    logger.error(id + " === updateEmailStatus Error");
                    console.log(error);
                });
            }else{
                //Update reason
                logger.error(id + " === ExecuteAuditEmail Error Email");
                return;
            }
            
            logger.info(id + " === ExecuteAuditEmail Completed");
        }else{
            logger.error(id + " === ExecuteAuditEmail Error Length");
            return
        }
 }
 

 module.exports = {
    ExecuteAuditEmail 
 };