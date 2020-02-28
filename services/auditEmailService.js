const uuid = require("uuid");
const axios = require("axios");
const logger = require("../config/logger");
const devToken = require("../config/keys").SECERT_JWT;

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
                // axios.post("http://localhost:5000/api/auditPdfBuilder/buildOpAuditPDF" , ffxAudit, { headers: { Authorization: devToken } }),
                axios.post("http://localhost:5000/api/AuditEmailSender/auditOpEmailSend/" , {opPDF, ffxAudit}, { headers: { Authorization: devToken } })
                ])
            .then(([opEmailResponse]) => {
                opEmail = opEmailResponse.data;
                // supportPDF = supportPdfResponse.data;
            })
            .catch(function(error) {
                console.log(error.response.data);
                error = true;
            });

            if(!error){
                //We didnt get an error, so update audits
                console.log("Updating Audit Record success");
            }else{
                logger.error(id + " === ExecuteAuditEmail Error Email");
                return;
            }


            
            //We sent email update audit record
            // if(opEmail){
            //     console.log(Email);

            // }else{
            //     console.log("No Email");
            // }
            logger.info(id + " === ExecuteAuditEmail Completed");
        }else{
            logger.error(id + " === ExecuteAuditEmail Error Length");
            return
        }
 }
 
 function foo() {
    //foo
 }
 
 module.exports = {
    ExecuteAuditEmail 
 };