const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const axios = require("axios");

//Logger
const logger = require("../../config/logger");
const PdfPrinter = require("pdfmake/src/printer");
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

const styleDEF = {
	header: {
		fontSize: 40,
		bold: true
	},
	anotherStyle: {
		italics: true,
		alignment: "right"
	}
};
const printer = new PdfPrinter(fonts);

const getDate = () => {
	var date = new Date();
	var formated = date.toLocaleDateString();
	return formated;
};

const devToken = async () => {
	let token = null;
	await axios.post("http://localhost:5000/getToken", {
		username: "dev",
		//TODO encrypt
		password: "dev"
	}).then(res => {
		token = res.data.token;
	}).catch(err => {
		logger.error("Could not get a Token");
		
	});
	return token
}

const todayData = async (token) => {
	await axios.get("http://localhost:5000/api/pfxTech/today", {
		 headers: { Authorization: `Bearer ${token}` } 
	}).then(res => {
		console.log(res)
	}).catch(err => {
		logger.error("Could not get todayData");
		
	});
	return null
}

// @route   GET documents/testPDF/
// @desc
// @access  Private
router.route("/testPDF").post(async function(req, res) {
	let id = uuid();
	let fieldsToAdd = [];
	let formatted = [];
	//Get A Token
	// const token = await devToken();
	// //Get Emails of who we are sending too
	// const today = await todayData(token);

	for (let [key, value] of Object.entries(req.body.Fields)) {
		if (value === true) {
			fieldsToAdd.push(key);
		}
	}
	//Format headers
	fieldsToAdd.map((field, idx) => {
		let test = auditFieldHeaders[field];
		console.log(test);
		formatted.push(test);
	});

	//Here is where we would get the data needed for TODAYS Games and create the array
	logger.info(id + " === Requesting Test PFx Daily Summary pdf");
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
							text: "AUDIT REPORT PREVIEW",
							style: { fontSize: 18, alignment: "center", margin: [0, 190, 0, 80] }
						}
					]
					 
				]
			},
			{ text: "New Audit Report for 2020_02_01_smtafa_smtafa_1", style: { fontSize: 12, margin: [0, 10, 0, 5] } },
			{
				table: {
					heights: 15,
					widths: "*",
					body: [
						
						[{ fontSize: 12, fillColor: "#eeeeee", text: formatted[0]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[1]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[2]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[3]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[4]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[5]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[6]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[7]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[8]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[9]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[10]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[11]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[12]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[13]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[14]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[15]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[16]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[17]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[18]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[19]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[20]}, 'Data'],
						[{ fillColor: "#eeeeee", text: formatted[21]}, 'Data'],

						
					]
				}
					// headerRows: 1,
					// widths: "*",
					// margin: [-50, 2, 10, 20],
					// body: [
					// 	//Sets Column Headers
                    //     formatted.map((field, idx) => {
                    //         return { fillColor: "#eeeeee", text: field};
                    //     }),
					// 	//Sets Values
					// 	formatted.map((inning, idx) => {
					// 		return { text: "Data" };
					// 	}),
					// 	formatted.map((inning, idx) => {
					// 		return { text: "Data" };
					// 	}),
					// 	formatted.map((inning, idx) => {
					// 		return { text: "Data" };
					// 	}),
					// 	formatted.map((inning, idx) => {
					// 		return { text: "Data" };
					// 	})
					// ]
				// }
			}
		]
	};

	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	pdfDoc.pipe(res);
	pdfDoc.end();
	logger.info(id + " === Returning Test PFx Daily Summary pdf");
});

module.exports = router;
