const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const devToken = require("../../config/keys").SECERT_JWT;
const axios = require("axios");
const pdfMakePrinter = require('pdfmake/src/printer');
const logger = require("../../config/logger");
const blobStream = require("blob-stream");
const fs = require("fs");

const fonts = {
	Roboto: {
		normal: "routes/documents/fonts/Roboto-Regular.ttf",
		bold: "fonts/Roboto-Medium.ttf",
		italics: "fonts/Roboto-Italic.ttf",
		bolditalics: "fonts/Roboto-MediumItalic.ttf"
	}
};

const printer = new pdfMakePrinter(fonts);

const auditFieldHeaders = {
		gamestring :"Gamestring",
		commentsBall :"Comments on Ball Trajectories",
		commentsMisc :"Miscellaneous Comments",
		commentsPlayer :"Comments on Player Pathing",
		logIn :"Log In (Eastern)",
		logOut :"Log Out (Eastern)",
		missedBIPVidGaps :"Missing Pitches due to Video Gaps",
		missedPitchesVidGaps :"Missing BIP due to Video Gaps",
		numBIPasPC :"Number of Balls in Play marked as P/C",
		numFBasPC :"Number of Foul Balls marked as P/C",
		numPicksAdded :"Number of Pickoffs Added",
		numPitchesAdded :"Number of Pitches Added",
		operator :"Operator",
		auditor :"Auditor",
		readyShare :"Is this Game ready to be Shared?",
		stepAccuracy :"Checked all Hits for Accuracy?",
		stepCompletion :"Confirmed all Pitches, Pickoffs & Steals?",
		stepResolving :"Finished Resolving the Game?",
		timeAccuracy :"Time Spent Checking Hits for Accuracy",
		timeCompletion :"Time Spent on Completion",
		timeResolving :"Time Spent Finishing Resolving",
		ffxPitches :"# Field FX Pitches",
		gdPitches :"# Gameday Pitches",
		vidGaps: "Video Gaps"
};

router.route("/buildAuditPDF").post(async function(req,res){
	let id = uuid();
	logger.info(id + " === buildAuditPDF Started");
	console.log(req.body);
	var auditData = req.body;
	if(auditData){
		//We have audit data, so build
		await buildAuditPdf(auditData, (response) =>{
				logger.info(id + " === buildAuditPDF returning");
				res.send(response)
		})
	}else{
		logger.info(id + " === buildAuditPDF failed");
	}
})

formatTime =(timeString) =>{
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? "AM" : "PM";
    return h + timeString.substr(2, 3) + ampm;
}


// @route   GET documents/testPDF/
// @desc
// @access  Private
// router.route("/buildAuditPDF").post(async function(req, res) {
buildAuditPdf = async (auditData, callback) => {
	let id = uuid();
	logger.info(id + " === building blob audit pdf");
	var data = [];
	data.push(auditData);
	//Format headers
	var titleStyle = {
		fillColor: "#eeeeee",
		fontSize: 11
	}

	var docDefinition = {
		pageOrientation: "portrait",
		content: [
			{
				columns: [
					{
						image: "routes/documents/images/SMT_PDF_Logo.jpg",
						fit: [100, 50]
					},
					[
						{
							text: "FIELD F/x Audit Report",
							style: { fontSize: 14, alignment: "center",}
						},
						{ text: "for  " +data[0].gamestring, style: { fontSize: 10,  alignment: "center",  } }
					]
				]
			},
			
			{
				table: {
					headerRows: 1,
					widths: [200 ,'*'],
					body: [
						[ {text: "Auditor", style: titleStyle }, {text: data[0].auditor} ],
						[ {text: "Operator", style: titleStyle}, {text: data[0].operator} ],
						[ {text: "Log In (Eastern)", style: titleStyle}, {text: formatTime(data[0].logIn) } ],
						[ {text: "Log Out (Eastern)", style: titleStyle}, {text: formatTime(data[0].logOut)} ],
						[ {text: "Is this Game ready to be Shared?", style: titleStyle}, {text: data[0].readyShare} ],
						[ {text: "Finished Resolving the Game?", style: titleStyle}, {text: data[0].stepResolving} ],
						[ {text: "Confirmed all Pitches, Pickoffs & Steals?", style: titleStyle}, {text: data[0].stepCompletion} ],
						[ {text: "Checked all Hits for Accuracy?", style: titleStyle}, {text: data[0].stepAccuracy} ],
						[ {text: "Time Spent Finishing Resolving", style: titleStyle}, {text: data[0].timeResolving +' Mins'} ],
						[ {text: "Time Spent on Completion", style: titleStyle}, {text: data[0].timeCompletion +' Mins'} ],
						[ {text: "Time Spent Checking Hits for Accuracy", style: titleStyle}, {text: data[0].timeAccuracy +' Mins'} ],
						[ {text: "# Field FX Pitches", style: titleStyle}, {text: data[0].ffxPitches} ],
						[ {text: "# Gameday Pitches", style: titleStyle}, {text: data[0].gdPitches} ],
						[ {text: "Video Gaps", style: titleStyle}, {text: data[0].vidGaps} ],
						[ {text: "Missing Pitches due to Video Gaps", style: titleStyle}, {text: data[0].missedPitchesVidGaps} ],
						[ {text: "Missing BIP due to Video Gaps", style: titleStyle}, {text: data[0].missedBIPVidGaps} ],
						[ {text: "Number of Pitches Added", style: titleStyle}, {text: data[0].numPitchesAdded} ],
						[ {text: "Number of Pickoffs Added", style: titleStyle}, {text: data[0].numPicksAdded} ],
						[ {text: "Number of Foul Balls marked as P/C", style: titleStyle}, {text: data[0].numFBasPC} ],
						[ {text: "Number of Balls in Play marked as P/C", style: titleStyle}, {text: data[0].numBIPasPC} ],
						[ {text: "Comments on Player Pathing", style: titleStyle}, {text: data[0].commentsPlayer} ],
						[ {text: "Comments on Ball Trajectories", style: titleStyle}, {text: data[0].commentsPlayer} ],
						[ {text: "Miscellaneous Comments", style: titleStyle}, {text: data[0].commentsMisc} ]
					]
				}
			}
		]	
	};
	
	
	const doc = printer.createPdfKitDocument(docDefinition);
	let chunks = [];
	
    doc.on('data', (chunk) => {
		chunks.push(chunk);
	});
	
	doc.on('end', () => {
		const result = Buffer.concat(chunks);
		callback('data:application/pdf;base64,' + result.toString('base64'));
	});
	
	doc.end();
};

module.exports = router;
