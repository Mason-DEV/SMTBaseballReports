const uuid = require("uuid");
const express = require("express");
const router = express.Router();

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

	var data = [
		{ 	
			gamestring :"2020_01_01_smtafa_smtafa_1",
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
			vidGaps: "Video Gaps",
			gameID: "Data"
		},
		
	];
	//Format headers
	var titleStyle = {
		fillColor: "#eeeeee",
		fontSize: 11
	}

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
							text: "FIELD F/x Audit PDF PREVIEW",
							style: { fontSize: 14, alignment: "center",}
						},
						{ text: "Report for  " +data[0].gamestring, style: { fontSize: 10,  alignment: "center",  } }
					]
				]
			},
			
			{
			table: {
            headerRows: 1,
            widths: [200 ,'*'],
                body: [
					[ {text: "Auditor", style: titleStyle }, {text: data[0].gameID} ],
					[ {text: "Operator", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Log In (Eastern)", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Log Out (Eastern)", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Is this Game ready to be Shared?", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Finished Resolving the Game?", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Confirmed all Pitches, Pickoffs & Steals?", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Checked all Hits for Accuracy?", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Time Spent Finishing Resolving", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Time Spent on Completion", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Time Spent Checking Hits for Accuracy", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "# Field FX Pitches", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "# Gameday Pitches", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Video Gaps", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Missing Pitches due to Video Gaps", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Missing BIP due to Video Gaps", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Number of Pitches Added", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Number of Pickoffs Added", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Number of Foul Balls marked as P/C", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Number of Balls in Play marked as P/C", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Comments on Player Pathing", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Comments on Ball Trajectories", style: titleStyle}, {text: data[0].gameID} ],
					[ {text: "Miscellaneous Comments", style: titleStyle}, {text: data[0].gameID} ]
                ]
              }
			}
		]	
};

	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	pdfDoc.pipe(res);
	pdfDoc.end();
	logger.info(id + " === Returning Test PFx Daily Summary pdf");
});

module.exports = router;
