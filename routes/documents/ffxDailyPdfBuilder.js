const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const devToken = require("../../config/keys").SECERT_JWT;
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

const ffxFieldHeaders = {
	venue: "Venue",
	operator: "Operator",
	support: "Support",
	bitMode: "Bit Mode",
	gameID: "Game ID",
	gameStatus: "Game Status",
	ipcrIssues: "IPCR Issues",
	fgdIssues: "FGD Issues",
	resolverIssues: "Resolver Issues",
	hardwareIssues: "Hardware Issues",
	miscNotes: "Misc Notes",
	date: "Date ",
	logIn: "Log In",
	logOut: "Log Out",
	firstPitch: "First Pitch",
	supportNotes: "Support Notes",
	bisonSet: "Bison Set",
	backupTask: "Backup Task",
	backupNotes: "Backup Notes"
};

const printer = new PdfPrinter(fonts);

const getDate = () => {
	var date = new Date();
	var formated = date.toLocaleDateString();
	return formated;
};

const getTime = () => {
	var date = new Date();
	var time = date.getTime();
	return time;
}

const todayData = async () => {
	var data = null;
	await axios.get("/api/ffxTech/todayDaily", {
		 headers: { Authorization: devToken } 
	}).then(res => {
		data = res.data
	}).catch(err => {
		logger.error("Could not get todayData");
		logger.error(err);
})
	return data

};

// @route   GET documents/testPDF/
// @desc
// @access  Private
router.route("/testPDF").post(async function(req, res) {
	let id = uuid();
	console.log(devToken);
	console.log(getTime())
	//Here is where we would get the data needed for TODAYS Games and create the array
	var data = [
		{ gameID: 'Data', operator: "Data", gameStatus: 'Data', supportNotes: 'Data' },
		{ gameID: 'Data', operator: "Data", gameStatus: 'Data', supportNotes: 'Data' },
		{ gameID: 'Data', operator: "Data", gameStatus: 'Data', supportNotes: 'Data' },
		
	];

	//Here is where we would get the data needed for TODAYS Games and create the array
	logger.info(id + " === Requesting Test FFx Daily Summary pdf");
	var docDefinition = {
		pageOrientation: "landscape",
		content: [
			{
				columns: [
					{
						image: "routes/documents/images/SMT_PDF_Logo.jpg",
						fit: [200, 100]
					},
					[
						{
							text: "FIELD F/x PDF REPORT PREVIEW",
							style: { fontSize: 18, alignment: "center", margin: [0, 190, 0, 80] }
						},
						{ text: "Daily Summary for  " +getDate(), style: { fontSize: 14,  alignment: "center", margin: [0, 190, 0, 80] } }
					]
				]
			},
			
			{
			table: {
            headerRows: 1,
            widths:  '*',
                body: [
					[ {text: "Gamestring", style:{ fillColor: "#eeeeee"}}, {text: "Operator", style:{ fillColor: "#eeeeee"}}, {text: "Game Status", style:{ fillColor: "#eeeeee"}}, {text: "Support Notes", style:{ fillColor: "#eeeeee"}} ],
                  [ {text: data[0].gameID }, {text: data[0].gameStatus}, {text: data[0].operator}, {text: data[0].supportNotes} ],
                  [ {text: data[1].gameID }, {text: data[1].gameStatus}, {text: data[1].operator}, {text: data[1].supportNotes} ],
                  [ {text: data[2].gameID }, {text: data[2].gameStatus}, {text: data[2].operator}, {text: data[2].supportNotes} ],
                  
                ]
              }
			}
		]
	};

	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	pdfDoc.pipe(res);
	pdfDoc.end();
	logger.info(id + " === Returning Test FFx Daily Summary pdf");
});

// @route   GET documents/FFxDailyPDF/
// @desc
// @access  Private
router.route("/FFxDailyPDF").post(async function(req, res) {
	let id = uuid();
	
	var data = await todayData();
	if(data == null){
		data = [{ gameID: 'No Games', operator: "No Games", gameStatus: 'No Games', supportNotes: 'No Games' }]
	}

	logger.info(id + " === Requesting FFx Daily Summary pdf");
	var docDefinition = {
		pageOrientation: "landscape",
		content: [
			{
				columns: [
					{
						image: "routes/documents/images/SMT_PDF_Logo.jpg",
						fit: [200, 100]
					},
					[
						{
							text: "FIELD F/x PDF REPORT PREVIEW",
							style: { fontSize: 18, alignment: "center", margin: [0, 190, 0, 80] }
						},
						{ text: "Daily Summary for  " +getDate(), style: { fontSize: 14,  alignment: "center", margin: [0, 190, 0, 80] } }
					]
				]
			},
			{
			table: {
            headerRows: 1,
            widths:  '*',
				body: [[ {text: "Gamestring", style:{ fillColor: "#eeeeee"}}, {text: "Operator", style:{ fillColor: "#eeeeee"}}, {text: "Game Status", style:{ fillColor: "#eeeeee"}}, {text: "Support Notes", style:{ fillColor: "#eeeeee"}} ]]
				.concat(data.map((game, i) => [game.gameID, game.operator, game.gameStatus, game.supportNotes]))
              }
			}
		]
	};
	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	pdfDoc.pipe(res);
	pdfDoc.end();
	logger.info(id + " === Returning FFx Daily Summary pdf");
});




module.exports = router;
