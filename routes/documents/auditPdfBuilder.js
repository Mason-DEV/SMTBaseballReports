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

// @route   POST api/auditPdfBuilder/buildOpAuditPDF
// @desc    Creates the OP audit pdf
// @access  Private
router.route("/buildOpAuditPDF").post(async function(req, res) {
	let id = uuid();
	logger.info(id + " === Building OP Audit PDF");
	var auditData = req.body;
	if(!auditData){
		logger.warn(id + "=== No FFx Audit in building OP Audit PDF");
		res.status(404).send("No FFx Audit in building OP Audit PDF");
	} else{
		//We have audit data, so build
		try {
			logger.info(" Trying to build PDF");
			await buildOpAuditPdf(auditData, (response) =>
			{	
				res.status(200).send(response);
			});
		} 
		catch (error) {
			logger.error(" Error on build PDF " + error);
			res.status(404).send(error);
		}
	}
});

// @route   POST api/auditPdfBuilder/buildSupportAuditPDF
// @desc    Creates the OP audit pdf
// @access  Private
router.route("/buildSupportAuditPDF").post(async function(req, res) {
	let id = uuid();
	logger.info(id + " === Building OP Audit PDF");
	var auditData = req.body;
	if(!auditData){
		logger.warn(id + "=== No FFx Audit in building OP Audit PDF");
		res.status(404).send("No FFx Audit in building OP Audit PDF");
	} else{
		//We have audit data, so build
		try {
			logger.info(" Trying to build PDF");
			await buildSupportAuditPdf(auditData, (response) =>
			{	
				res.status(200).send(response);
			});
		} 
		catch (error) {
			logger.error(" Error on build PDF " + error);
			res.status(404).send(error);
		}
	}
});

formatTime =(timeString) =>{
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? "AM" : "PM";
    return h + timeString.substr(2, 3) + ampm;
}

buildOpAuditPdf = (auditData, callback) => {
	//Format headers
	var titleStyle = {
		fillColor: "#a6deb9",
		fontSize: 11
	}
		var data = [];
		data.push(auditData);

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
								text: "FIELD F/x Audit Report for",
								style: { fontSize: 14, alignment: "center",}
							},
								{ text: data[0].gamestring, style: {fontSize: 11,  alignment: "center",  } }
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
							// [ {text: "Is this Game ready to be Shared?", style: titleStyle}, {text: data[0].readyShare} ],
							// [ {text: "Finished Resolving the Game?", style: titleStyle}, {text: data[0].stepResolving} ],
							// [ {text: "Confirmed all Pitches, Pickoffs & Steals?", style: titleStyle}, {text: data[0].stepCompletion} ],
							// [ {text: "Checked all Hits for Accuracy?", style: titleStyle}, {text: data[0].stepAccuracy} ],
							// [ {text: "Time Spent Finishing Resolving", style: titleStyle}, {text: data[0].timeResolving +' Mins'} ],
							// [ {text: "Time Spent on Completion", style: titleStyle}, {text: data[0].timeCompletion +' Mins'} ],
							// [ {text: "Time Spent Checking Hits for Accuracy", style: titleStyle}, {text: data[0].timeAccuracy +' Mins'} ],
							// [ {text: "# Field FX Pitches", style: titleStyle}, {text: data[0].ffxPitches} ],
							// [ {text: "# Gameday Pitches", style: titleStyle}, {text: data[0].gdPitches} ],
							// [ {text: "Video Gaps", style: titleStyle}, {text: data[0].vidGaps} ],
							// [ {text: "Missing Pitches due to Video Gaps", style: titleStyle}, {text: data[0].missedPitchesVidGaps} ],
							// [ {text: "Missing BIP due to Video Gaps", style: titleStyle}, {text: data[0].missedBIPVidGaps} ],
							[ {text: "Number of Pitches Added", style: titleStyle}, {text: data[0].numPitchesAdded} ],
							[ {text: "Number of Pickoffs Added", style: titleStyle}, {text: data[0].numPicksAdded} ],
							[ {text: "Number of Foul Balls marked as P/C", style: titleStyle}, {text: data[0].numFBasPC} ],
							[ {text: "Number of Balls in Play marked as P/C", style: titleStyle}, {text: data[0].numBIPasPC} ],
							[ {text: "Comments on Player Pathing", style: titleStyle}, {text: data[0].commentsPlayer} ],
							[ {text: "Comments on Ball Trajectories", style: titleStyle}, {text: data[0].commentsBall} ],
							[ {text: "Miscellaneous Comments", style: titleStyle}, {text: data[0].commentsMisc} ]
						]
					}
				}
			]	
		};

		let id = uuid();
		logger.info(id + " === building blob audit pdf");
		const doc = printer.createPdfKitDocument(docDefinition);
		let chunks = [];
		
		doc.on('data', (chunk) => {
			chunks.push(chunk);
		})
		
		doc.on('end', () => {
			const result = Buffer.concat(chunks);
			logger.info(id + " === building blob audit pdf");
			callback('data:application/pdf;base64,' + result.toString('base64'));
		})
		
		doc.end();
};

buildSupportAuditPdf = (auditData, callback) => {
	//Format headers
	var titleStyle = {
		fillColor: "#a6deb9",
		fontSize: 11
	}
		var data = [];
		data.push(auditData);

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
								text: "FIELD F/x Audit Report for",
								style: { fontSize: 14, alignment: "center",}
							},
								{ text: data[0].gamestring, style: {fontSize: 11,  alignment: "center",  } }
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
							[ {text: "Comments on Ball Trajectories", style: titleStyle}, {text: data[0].commentsBall} ],
							[ {text: "Miscellaneous Comments", style: titleStyle}, {text: data[0].commentsMisc} ]
						]
					}
				}
			]	
		};

		let id = uuid();
		logger.info(id + " === building blob audit pdf");
		const doc = printer.createPdfKitDocument(docDefinition);
		let chunks = [];
		
		doc.on('data', (chunk) => {
			chunks.push(chunk);
		})
		
		doc.on('end', () => {
			const result = Buffer.concat(chunks);
			logger.info(id + " === building blob audit pdf");
			callback('data:application/pdf;base64,' + result.toString('base64'));
		})
		
		doc.end();
};

module.exports = router;
